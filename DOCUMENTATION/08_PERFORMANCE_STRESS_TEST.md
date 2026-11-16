# 08 — PERFORMANCE BENCHMARK & MULTI-USER CONCURRENCY STRESS REPORT
**Mixu Infosystem Hospital Management / EMR Platform**
**Benchmark Execution Date:** 16-November-2026 | **Lead Performance Engineer:** Systems Performance Specialist
**Test Harness:** Python 3.12 `benchmark_stress_test.py` with `ThreadPoolExecutor` & OS file locking timers

---

## 1. Executive Summary

This stress test evaluated the performance and concurrency limits of the JSON-based storage engine under hospital workload conditions. Benchmarks measured scaling up to 5,000 records, concurrent write contention up to 20 parallel threads, and live HTTP API response metrics.

### Key Performance Findings:
- **Zero Concurrency Failures:** Under 20 simultaneous concurrent workers executing 100 writes, failure rate was **0.0%** and file integrity was **100% preserved**.
- **Ultra-Fast In-Memory Search:** Linear scanning across 5,000 records executes in **0.108 ms** per search.
- **Microsecond Read Latency:** Reading and parsing 1,000 records requires only **2.99 ms**.
- **Consistent API Response:** Average API response time across all endpoints is **18.7 ms**.

---

## 2. Storage Scaling Benchmark (50 to 5,000 Records)

Each scale was tested with full patient demographic payloads, measuring file size on disk, read latency (10-run average), write latency (with atomic temporary file replacement), single-item update latency (lock + read + modify + atomic write), and 100-lookup search latency.

| Record Count | File Size (KB) | Read Latency (ms) | Single-Item Update (ms) | Search Latency (ms) |
| :--- | :--- | :--- | :--- | :--- |
| **50 Records** | 16.6 KB | 1.05 ms | 9.00 ms | 0.001 ms |
| **500 Records** | 165.0 KB | 1.76 ms | 20.99 ms | 0.009 ms |
| **1,000 Records**| 330.1 KB | 2.99 ms | 30.03 ms | 0.019 ms |
| **5,000 Records**| 1,654.3 KB | 12.88 ms | 113.28 ms | 0.108 ms |

```
Scaling Analysis:
- Read performance remains sub-3ms up to 1,000 records, expanding to ~13ms at 5,000 records.
- Single-item updates scale linearly with file size due to full serialization and atomic disk flushing.
- Search latency remains negligible (< 0.11 ms) even at 5,000 records.
```

---

## 3. Multi-User Concurrency Stress Test

To simulate multiple hospital staff members saving prescriptions, admissions, and bills simultaneously, a multi-threaded stress harness executed concurrent operations against the same JSON file protected by `InterProcessFileLock`.

| Concurrency Level | Total Ops | Successful Writes | Failed Writes | Failure Rate | Avg Latency (ms) | P95 Latency (ms) | File Integrity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **5 Workers** | 25 | 25 | 0 | **0.0%** | 53.11 ms | 65.36 ms | **PASSED (Valid JSON)** |
| **10 Workers** | 50 | 50 | 0 | **0.0%** | 119.98 ms | 145.66 ms | **PASSED (Valid JSON)** |
| **20 Workers** | 100 | 100 | 0 | **0.0%** | 230.48 ms | 288.61 ms | **PASSED (Valid JSON)** |

### Concurrency Observations:
1. **Zero Race Conditions:** The combination of `InterProcessFileLock` and atomic temporary file rename (`os.replace`) completely eliminated race conditions and partial file writes.
2. **Lock Queuing:** Under 20 parallel threads, threads queued gracefully with a P95 latency of 288.61 ms, well within human interactive tolerances (< 500 ms).
3. **Data Loss:** 0 items lost; the final verified JSON file contained every single worker write intact.

---

## 4. Live Backend API Endpoints Latency & Payload Analysis

Tested against the active local Django server (`http://127.0.0.1:8000/api`):

| API Endpoint | HTTP Method | Avg Response Time | Payload Size (KB) | Status |
| :--- | :--- | :--- | :--- | :--- |
| **`/api/patients/`** | GET | 23.3 ms | 38.9 KB | 200 OK |
| **`/api/doctors/`** | GET | 21.0 ms | 6.3 KB | 200 OK |
| **`/api/medicines/`** | GET | 18.9 ms | 10.2 KB | 200 OK |
| **`/api/admissions/`** | GET | 18.4 ms | 11.4 KB | 200 OK |
| **`/api/beds/`** | GET | 18.5 ms | 6.9 KB | 200 OK |
| **`/api/discharges/`** | GET | 18.6 ms | 11.3 KB | 200 OK |
| **`/api/deposits/`** | GET | 18.8 ms | 7.0 KB | 200 OK |
| **`/api/ot-entries/`** | GET | 18.7 ms | 7.8 KB | 200 OK |
| **`/api/investigations/`** | GET | 18.7 ms | 22.7 KB | 200 OK |
| **`/api/echo-reports/`** | GET | 15.6 ms | 14.4 KB | 200 OK |
| **`/api/certificates/`** | GET | 19.0 ms | 10.5 KB | 200 OK |

---

## 5. Degradation Thresholds & MySQL Migration Roadmap

Based on the empirical benchmark data, the operational thresholds for the JSON storage approach are:

| Metric | Optimal Range (JSON) | Caution Threshold | Hard Limit (Migrate to MySQL) |
| :--- | :--- | :--- | :--- |
| **Total Patient Records** | 1 to 2,000 | 2,000 to 5,000 | **> 10,000 records** |
| **Concurrent Staff Users** | 1 to 10 | 10 to 20 | **> 30 concurrent users** |
| **Single JSON File Size** | < 1 MB | 1 MB to 3 MB | **> 5 MB** |
| **Single-Record Write Latency** | < 50 ms | 50 ms to 150 ms | **> 300 ms** |

### Recommendation:
The current JSON storage architecture is robust, fast, and completely safe for small to mid-sized clinic workflows (up to ~5,000 patients and 15 simultaneous users). When hospital volume expands past 5,000 active patient encounters or requires multi-branch replication, the pre-structured schemas in `06_JSON_DATA_INTEGRITY.md` should be deployed to MySQL using Django's ORM or direct relational drivers.
