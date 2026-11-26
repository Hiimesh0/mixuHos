"""
Cross-Platform Inter-Process File Locking Utility for Hospital EMR JSON Storage.
Guarantees concurrency safety across multiple WSGI worker processes (Gunicorn, uWSGI)
and multiple threads without requiring external database services.
Supports Windows (msvcrt) and POSIX / Linux / macOS (fcntl).
Features true re-entrancy for nested read/write calls within the same thread.
"""

import os
import sys
import time
import threading
from pathlib import Path

# Thread-local storage for re-entrancy tracking
_local_state = threading.local()

# Process-level thread lock registry
_global_thread_locks = {}
_meta_lock = threading.Lock()


def _get_thread_lock(lock_path: str) -> threading.RLock:
    with _meta_lock:
        if lock_path not in _global_thread_locks:
            _global_thread_locks[lock_path] = threading.RLock()
        return _global_thread_locks[lock_path]


class InterProcessFileLock:
    """
    Re-entrant context manager that acquires both an in-process thread lock
    and an operating-system-level inter-process file lock.
    """

    def __init__(self, target_file_path: Path, timeout: float = 10.0, retry_interval: float = 0.05):
        self.target_path = Path(target_file_path)
        self.lock_file_path = self.target_path.with_suffix(self.target_path.suffix + ".lock")
        self.timeout = timeout
        self.retry_interval = retry_interval
        self._thread_lock = _get_thread_lock(str(self.lock_file_path))

    def _get_recursion_depth(self) -> int:
        if not hasattr(_local_state, "lock_depths"):
            _local_state.lock_depths = {}
        return _local_state.lock_depths.get(str(self.lock_file_path), 0)

    def _set_recursion_depth(self, depth: int) -> None:
        if not hasattr(_local_state, "lock_depths"):
            _local_state.lock_depths = {}
        _local_state.lock_depths[str(self.lock_file_path)] = depth

    def _get_file_handle(self):
        if not hasattr(_local_state, "file_handles"):
            _local_state.file_handles = {}
        return _local_state.file_handles.get(str(self.lock_file_path))

    def _set_file_handle(self, handle):
        if not hasattr(_local_state, "file_handles"):
            _local_state.file_handles = {}
        _local_state.file_handles[str(self.lock_file_path)] = handle

    def __enter__(self):
        # 1. Acquire in-process thread lock (RLock is re-entrant)
        self._thread_lock.acquire()

        depth = self._get_recursion_depth()
        if depth > 0:
            # Already holding the OS lock in this thread/process
            self._set_recursion_depth(depth + 1)
            return self

        # 2. Acquire inter-process OS file lock with timeout
        start_time = time.time()
        self.lock_file_path.parent.mkdir(parents=True, exist_ok=True)
        handle = None

        while True:
            try:
                handle = open(self.lock_file_path, "a+b")

                if os.name == "nt":
                    import msvcrt
                    handle.seek(0)
                    msvcrt.locking(handle.fileno(), msvcrt.LK_NBLCK, 1)
                else:
                    import fcntl
                    fcntl.flock(handle.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)

                # Lock successfully acquired at OS level
                self._set_file_handle(handle)
                self._set_recursion_depth(1)
                return self

            except (IOError, OSError):
                if handle:
                    try:
                        handle.close()
                    except OSError:
                        pass
                    handle = None

                elapsed = time.time() - start_time
                if elapsed >= self.timeout:
                    self._thread_lock.release()
                    raise TimeoutError(
                        f"Timed out waiting {self.timeout}s for file lock on '{self.lock_file_path}'"
                    )

                time.sleep(self.retry_interval)

    def __exit__(self, exc_type, exc_val, exc_tb):
        depth = self._get_recursion_depth()
        if depth > 1:
            self._set_recursion_depth(depth - 1)
            self._thread_lock.release()
            return

        # Depth is 1: release OS lock and close file handle
        try:
            handle = self._get_file_handle()
            if handle:
                try:
                    if os.name == "nt":
                        import msvcrt
                        handle.seek(0)
                        msvcrt.locking(handle.fileno(), msvcrt.LK_UNLCK, 1)
                    else:
                        import fcntl
                        fcntl.flock(handle.fileno(), fcntl.LOCK_UN)
                except OSError:
                    pass
                finally:
                    try:
                        handle.close()
                    except OSError:
                        pass
                    self._set_file_handle(None)
        finally:
            self._set_recursion_depth(0)
            self._thread_lock.release()
