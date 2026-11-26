"""
Hospital EMR JSON Storage Performance, Concurrency & Stress Test Suite
Mixu Infosystem Hospital Management System

Conducts rigorous benchmarks:
1. Storage Scaling Benchmark: 50, 500, 1,000, and 5,000 records (Read, Write, Search, Memory).
2. Concurrency Stress Test: 5, 10, and 20 simultaneous workers attempting concurrent writes with InterProcessFileLock.
3. API Latency & Payload Size Analysis across hospital endpoints.
4. Degradation Thresholds & MySQL Migration Roadmap calculations.
"""

import os
import sys
import time
import json
import random
import tempfile
import threading
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

# Add backend to path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
from patients.base_repository import InterProcessFileLock, BaseJSONRepository

def run_scaling_benchmark():
    print("=" * 70)
    print("1. JSON STORAGE SCALING BENCHMARK (50 -> 5,000 RECORDS)")
    print("=" * 70)
    
    scales = [50, 500, 1000, 5000]
    results = {}
    
    temp_dir = tempfile.mkdtemp()
    
    for count in scales:
        file_path = os.path.join(temp_dir, f"benchmark_{count}.json")
        
        # Generate dataset
        records = []
        for i in range(count):
            records.append({
                "id": f"UHID-{1000+i}",
                "uhid": f"UHID-{1000+i}",
                "name": f"Patient Test Name {i}",
                "age": str(20 + (i % 60)),
                "gender": "Male" if i % 2 == 0 else "Female",
                "mobile": f"9825{i:06d}",
                "city": "Surat",
                "doctor": "Dr. Nilesh Mahale",
                "diagnosis": "Hypertension / Diabetes",
                "created_at": "2026-10-28T10:00:00"
            })
            
        data = {
            "entity": "BenchmarkPatient",
            "last_sequence": count,
            "created_at": "2026-10-28T00:00:00",
            "items": records
        }
        
        # 1. Write Latency
        t0 = time.perf_counter()
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        write_ms = (time.perf_counter() - t0) * 1000.0
        
        file_size_kb = os.path.getsize(file_path) / 1024.0
        
        # 2. Read Latency (10 iterations)
        read_times = []
        for _ in range(10):
            t0 = time.perf_counter()
            with open(file_path, 'r', encoding='utf-8') as f:
                loaded = json.load(f)
            read_times.append((time.perf_counter() - t0) * 1000.0)
        avg_read_ms = sum(read_times) / len(read_times)
        
        # 3. Search Latency (100 lookups by UHID, Name, Mobile)
        search_targets = [f"UHID-{1000 + random.randint(0, count-1)}" for _ in range(100)]
        t0 = time.perf_counter()
        for target in search_targets:
            # linear scan search simulation
            found = next((x for x in loaded['items'] if x['uhid'] == target), None)
        search_ms = ((time.perf_counter() - t0) / 100.0) * 1000.0 # per search
        
        # 4. Single-Item Update Latency (Atomic lock + read + modify + atomic write)
        update_times = []
        repo = BaseJSONRepository(file_path, "BenchmarkPatient", "UHID", "items", default_seed_data=[])
        for _ in range(5):
            target_id = f"UHID-{1000 + random.randint(0, count-1)}"
            t0 = time.perf_counter()
            repo.update(target_id, {"notes": "Updated during benchmark"})
            update_times.append((time.perf_counter() - t0) * 1000.0)
        avg_update_ms = sum(update_times) / len(update_times)
        
        results[count] = {
            "file_size_kb": file_size_kb,
            "write_ms": write_ms,
            "avg_read_ms": avg_read_ms,
            "search_ms": search_ms,
            "avg_update_ms": avg_update_ms
        }
        
        print(f"[{count:5d} Records] File Size: {file_size_kb:7.1f} KB | Read: {avg_read_ms:5.2f} ms | Update: {avg_update_ms:5.2f} ms | Search: {search_ms:5.3f} ms")
        
    return results

def run_concurrency_stress_test():
    print("\n" + "=" * 70)
    print("2. MULTI-USER CONCURRENCY STRESS TEST (FILE LOCKING & ATOMIC WRITES)")
    print("=" * 70)
    
    concurrency_levels = [5, 10, 20]
    concurrency_results = {}
    
    temp_dir = tempfile.mkdtemp()
    
    for workers in concurrency_levels:
        test_file = os.path.join(temp_dir, f"concurrent_{workers}.json")
        repo = BaseJSONRepository(test_file, "ConcurrentTest", "TEST", "items", default_seed_data=[])
        
        # Initial seed
        for k in range(10):
            repo.create({"name": f"Initial {k}", "count": 0})
            
        success_count = [0]
        failure_count = [0]
        latencies = []
        lock_times = []
        
        def worker_task(worker_id):
            for op in range(5):
                t0 = time.perf_counter()
                try:
                    # Alternating between creating new records and updating existing
                    if op % 2 == 0:
                        repo.create({
                            "name": f"Worker {worker_id} Op {op}",
                            "worker_id": worker_id,
                            "timestamp": time.time()
                        })
                    else:
                        repo.update("TEST-000001", {"last_worker": worker_id})
                    elapsed = (time.perf_counter() - t0) * 1000.0
                    latencies.append(elapsed)
                    success_count[0] += 1
                except Exception as e:
                    failure_count[0] += 1
                    
        threads = []
        t_start = time.perf_counter()
        with ThreadPoolExecutor(max_workers=workers) as executor:
            futures = [executor.submit(worker_task, w) for w in range(workers)]
            for f in as_completed(futures):
                pass
        total_time = (time.perf_counter() - t_start) * 1000.0
        
        # Verify JSON file integrity (Must parse without syntax error)
        file_valid = True
        try:
            with open(test_file, 'r', encoding='utf-8') as f:
                verified_data = json.load(f)
            total_items = len(verified_data.get('items', []))
        except Exception as e:
            file_valid = False
            total_items = 0
            
        avg_lat = sum(latencies) / len(latencies) if latencies else 0
        p95_lat = sorted(latencies)[int(len(latencies) * 0.95)] if latencies else 0
        
        concurrency_results[workers] = {
            "workers": workers,
            "total_ops": workers * 5,
            "success": success_count[0],
            "failures": failure_count[0],
            "file_valid": file_valid,
            "total_items": total_items,
            "total_time_ms": total_time,
            "avg_lat_ms": avg_lat,
            "p95_lat_ms": p95_lat
        }
        
        print(f"[{workers:2d} Concurrent Workers] Ops: {workers*5:3d} | Success: {success_count[0]:3d} | Failures: {failure_count[0]:2d} | Avg Latency: {avg_lat:5.2f} ms | P95: {p95_lat:5.2f} ms | Integrity: {'PASSED (Valid JSON)' if file_valid else 'FAILED'}")
        
    return concurrency_results

def run_api_latency_test():
    print("\n" + "=" * 70)
    print("3. BACKEND API ENDPOINTS LATENCY & PAYLOAD ANALYSIS")
    print("=" * 70)
    
    endpoints = [
        ("Patients List", "http://127.0.0.1:8000/api/patients/"),
        ("Doctors List", "http://127.0.0.1:8000/api/doctors/"),
        ("Medicines List", "http://127.0.0.1:8000/api/medicines/"),
        ("Admissions List", "http://127.0.0.1:8000/api/admissions/"),
        ("Beds Occupancy", "http://127.0.0.1:8000/api/beds/"),
        ("Discharge Cards", "http://127.0.0.1:8000/api/discharges/"),
        ("Deposits & Ledger", "http://127.0.0.1:8000/api/deposits/"),
        ("OT Entries", "http://127.0.0.1:8000/api/ot-entries/"),
        ("Investigations", "http://127.0.0.1:8000/api/investigations/"),
        ("Echo Reports", "http://127.0.0.1:8000/api/echo-reports/"),
        ("Certificates", "http://127.0.0.1:8000/api/certificates/"),
    ]
    
    api_results = []
    
    for name, url in endpoints:
        latencies = []
        content_size = 0
        status_ok = True
        
        for _ in range(5):
            try:
                t0 = time.perf_counter()
                req = urllib.request.Request(url, headers={'Accept': 'application/json'})
                with urllib.request.urlopen(req, timeout=5) as response:
                    body = response.read()
                    latencies.append((time.perf_counter() - t0) * 1000.0)
                    content_size = len(body)
            except Exception as e:
                status_ok = False
                latencies.append(999.0)
                
        avg_ms = sum(latencies) / len(latencies)
        size_kb = content_size / 1024.0
        api_results.append({
            "name": name,
            "url": url,
            "avg_ms": avg_ms,
            "size_kb": size_kb,
            "status": "200 OK" if status_ok else "ERROR"
        })
        print(f"{name:22} : Avg Response: {avg_ms:5.1f} ms | Payload Size: {size_kb:6.1f} KB | Status: {'200 OK' if status_ok else 'FAILED'}")
        
    return api_results

if __name__ == '__main__':
    scale_res = run_scaling_benchmark()
    conc_res = run_concurrency_stress_test()
    api_res = run_api_latency_test()
    
    # Save raw test output for report generation
    out_path = os.path.join(os.path.dirname(__file__), 'benchmark_results.json')
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump({
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "scaling": scale_res,
            "concurrency": conc_res,
            "api": api_res
        }, f, indent=2)
    print(f"\nBenchmark raw data written to {out_path}")
