import io
import json
import shutil
import tempfile
from pathlib import Path
from django.test import TestCase, SimpleTestCase
from rest_framework.test import APIClient
from rest_framework import status
from .storage import PatientJSONStorage


class PatientModuleAPITests(SimpleTestCase):
    """
    Test suite for Patient Registration JSON storage and REST API endpoints.
    Uses an isolated temporary storage file to avoid touching development data.
    """

    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        self.temp_file = Path(self.temp_dir) / "test_patients.json"
        self.storage = PatientJSONStorage(file_path=self.temp_file)

        # Patch the views' storage instance
        from . import views
        self.orig_storage = views.storage
        views.storage = self.storage

        from .bill_storage import BillJSONStorage
        import patients.bill_storage
        self.temp_bills_file = Path(self.temp_dir) / "test_bills.json"
        self.test_bill_storage = BillJSONStorage(file_path=self.temp_bills_file)
        self.orig_bill_storage = patients.bill_storage.bill_storage
        patients.bill_storage.bill_storage = self.test_bill_storage

        self.client = APIClient()

    def tearDown(self):
        from . import views
        import patients.bill_storage
        views.storage = self.orig_storage
        patients.bill_storage.bill_storage = self.orig_bill_storage
        shutil.rmtree(self.temp_dir, ignore_errors=True)


    def test_initial_patient_list_is_empty(self):
        """Test GET /api/patients/ returns empty list initially."""
        response = self.client.get("/api/patients/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["count"], 0)
        self.assertEqual(response.data["patients"], [])

    def test_create_patient_validation_failures(self):
        """Test POST /api/patients/ rejects invalid or missing required fields."""
        # Missing firstName
        payload_no_name = {
            "mobile": "9876543210",
            "age": "30",
            "hospitalDoctor": "Dr. Sharma"
        }
        res = self.client.post("/api/patients/", payload_no_name, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("firstName", res.data["details"])

        # Invalid mobile format
        payload_bad_mobile = {
            "firstName": "John",
            "mobile": "123",
            "age": "30",
            "hospitalDoctor": "Dr. Sharma"
        }
        res = self.client.post("/api/patients/", payload_bad_mobile, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("mobile", res.data["details"])

        # Invalid age
        payload_bad_age = {
            "firstName": "John",
            "mobile": "9876543210",
            "age": "999",
            "hospitalDoctor": "Dr. Sharma"
        }
        res = self.client.post("/api/patients/", payload_bad_age, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("age", res.data["details"])

    def test_create_and_retrieve_patient(self):
        """Test POST /api/patients/ creates a patient and saves to JSON file."""
        payload = {
            "category": "NEW",
            "firstName": "Aarav",
            "lastName": "Patel",
            "mobile": "9876543210",
            "age": "28",
            "sex": "Male",
            "hospitalDoctor": "Dr. NILESH MAHALE",
            "city": "SURAT",
            "state": "GUJARAT"
        }
        create_res = self.client.post("/api/patients/", payload, format="json")
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(create_res.data["success"])

        patient = create_res.data["patient"]
        uhid = patient["uhid"]
        self.assertTrue(uhid.startswith("UHID-"))
        self.assertEqual(patient["firstName"], "Aarav")
        self.assertIn("createdAt", patient)
        self.assertIn("updatedAt", patient)

        # Confirm saved in JSON file on disk
        with open(self.temp_file, "r", encoding="utf-8") as f:
            disk_data = json.load(f)
            self.assertEqual(len(disk_data["patients"]), 1)
            self.assertEqual(disk_data["patients"][0]["uhid"], uhid)

        # GET /api/patients/<uhid>/
        get_res = self.client.get(f"/api/patients/{uhid}/")
        self.assertEqual(get_res.status_code, status.HTTP_200_OK)
        self.assertEqual(get_res.data["patient"]["firstName"], "Aarav")

    def test_update_patient(self):
        """Test PUT /api/patients/<id>/ updates fields and preserves UHID + createdAt."""
        create_res = self.client.post(
            "/api/patients/",
            {
                "firstName": "Priya",
                "lastName": "Shah",
                "mobile": "9825012345",
                "age": "32",
                "sex": "Female",
                "hospitalDoctor": "Dr. NILESH MAHALE"
            },
            format="json"
        )
        patient_id = create_res.data["patient"]["id"]
        original_created_at = create_res.data["patient"]["createdAt"]

        # Update
        update_res = self.client.put(
            f"/api/patients/{patient_id}/",
            {
                "firstName": "Priya",
                "lastName": "Shah-Desai",
                "mobile": "9825012345",
                "age": "33",
                "hospitalDoctor": "Dr. NILESH MAHALE",
                "city": "AHMEDABAD"
            },
            format="json"
        )
        self.assertEqual(update_res.status_code, status.HTTP_200_OK)
        updated = update_res.data["patient"]
        self.assertEqual(updated["lastName"], "Shah-Desai")
        self.assertEqual(updated["age"], "33")
        self.assertEqual(updated["city"], "AHMEDABAD")
        self.assertEqual(updated["createdAt"], original_created_at)
        self.assertEqual(updated["id"], patient_id)

    def test_delete_patient(self):
        """Test DELETE /api/patients/<id>/ removes patient from JSON storage."""
        create_res = self.client.post(
            "/api/patients/",
            {
                "firstName": "Vikram",
                "lastName": "Mehta",
                "mobile": "9898012345",
                "age": "45",
                "hospitalDoctor": "Dr. NILESH MAHALE"
            },
            format="json"
        )
        patient_id = create_res.data["patient"]["id"]

        del_res = self.client.delete(f"/api/patients/{patient_id}/")
        self.assertEqual(del_res.status_code, status.HTTP_200_OK)
        self.assertTrue(del_res.data["success"])

        # Confirm 404 on subsequent get
        get_res = self.client.get(f"/api/patients/{patient_id}/")
        self.assertEqual(get_res.status_code, status.HTTP_404_NOT_FOUND)

        # Confirm empty in JSON file
        with open(self.temp_file, "r", encoding="utf-8") as f:
            disk_data = json.load(f)
            self.assertEqual(len(disk_data["patients"]), 0)

    def test_instant_search_and_filters(self):
        """Test GET /api/patients/ search and filter query parameters."""
        # Insert 3 test patients
        self.client.post("/api/patients/", {
            "firstName": "Karan", "lastName": "Kapoor", "mobile": "9111111111",
            "age": "25", "sex": "Male", "hospitalDoctor": "Dr. Sharma", "city": "SURAT"
        }, format="json")
        self.client.post("/api/patients/", {
            "firstName": "Kavita", "lastName": "Kapoor", "mobile": "9222222222",
            "age": "27", "sex": "Female", "hospitalDoctor": "Dr. Sharma", "city": "MUMBAI"
        }, format="json")
        self.client.post("/api/patients/", {
            "firstName": "Amit", "lastName": "Verma", "mobile": "9333333333",
            "age": "40", "sex": "Male", "hospitalDoctor": "Dr. Patel", "city": "SURAT"
        }, format="json")

        # Search by partial name "kav"
        res = self.client.get("/api/patients/?search=kav")
        self.assertEqual(res.data["count"], 1)
        self.assertEqual(res.data["patients"][0]["firstName"], "Kavita")

        # Search by surname "Kapoor" -> should match 2
        res = self.client.get("/api/patients/?search=kapoor")
        self.assertEqual(res.data["count"], 2)

        # Filter by gender "Female"
        res = self.client.get("/api/patients/?gender=Female")
        self.assertEqual(res.data["count"], 1)
        self.assertEqual(res.data["patients"][0]["firstName"], "Kavita")

        # Combined search "Kapoor" + gender "Male" -> should match 1 ("Karan")
        res = self.client.get("/api/patients/?search=kapoor&gender=Male")
        self.assertEqual(res.data["count"], 1)
        self.assertEqual(res.data["patients"][0]["firstName"], "Karan")

    def test_patient_sticker_pdf_endpoint(self):
        """Test GET /api/patients/<patient_id>/sticker.pdf generates valid PDF with scannable barcode."""
        # Create a patient
        create_res = self.client.post("/api/patients/", {
            "firstName": "VIPUL",
            "middleName": "KUMAR",
            "lastName": "VASAVA",
            "birthDate": "1996-01-01",
            "age": "30",
            "ageUnit": "Years",
            "sex": "Male",
            "hospitalDoctor": "Dr. DEVANG DESAI / JIGAR PATEL",
            "referenceBy": "DR. DAYARAM VASAVA",
            "mobile": "8141298303",
            "streetAddress": "SURAT",
            "city": "SURAT",
            "state": "GUJARAT",
        }, format="json")
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        uhid = create_res.data["patient"]["uhid"]

        # Call sticker endpoint
        pdf_res = self.client.get(f"/api/patients/{uhid}/sticker.pdf")
        self.assertEqual(pdf_res.status_code, status.HTTP_200_OK)
        self.assertEqual(pdf_res["Content-Type"], "application/pdf")
        self.assertIn(f'filename="Patient_Sticker_{uhid}.pdf"', pdf_res["Content-Disposition"])
        # Verify PDF header and A4 page dimensions
        content = pdf_res.content
        self.assertTrue(content.startswith(b"%PDF-"))

        import pypdf
        reader = pypdf.PdfReader(io.BytesIO(content))
        self.assertEqual(len(reader.pages), 1)
        p0 = reader.pages[0]
        w_mm = float(p0.mediabox.width) * 25.4 / 72.0
        h_mm = float(p0.mediabox.height) * 25.4 / 72.0
        self.assertAlmostEqual(w_mm, 210.0, delta=1.0)
        self.assertAlmostEqual(h_mm, 297.0, delta=1.0)

        # Verify extracted text contains hospital name 'XYZ' and patient UHID
        pdf_text = p0.extract_text()
        self.assertIn("XYZ", pdf_text)
        self.assertIn(uhid, pdf_text)

        # Verify barcode generation and scan verification from embedded PDF image
        import zxingcpp
        from PIL import Image

        images = list(p0.images)
        self.assertGreater(len(images), 0)
        embedded_img = Image.open(io.BytesIO(images[0].data))
        scan_results = zxingcpp.read_barcodes(embedded_img)
        self.assertGreater(len(scan_results), 0)
        self.assertEqual(scan_results[0].text, uhid)
        self.assertIn("128", str(scan_results[0].format))

        # Test invalid patient ID returns 404
        bad_res = self.client.get("/api/patients/NON-EXISTENT-ID/sticker.pdf")
        self.assertEqual(bad_res.status_code, status.HTTP_404_NOT_FOUND)

    def test_hospital_config_endpoint(self):
        """Test GET /api/hospital/config/ returns centralized hospital details."""
        res = self.client.get("/api/hospital/config/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data["success"])
        cfg = res.data["config"]
        self.assertEqual(cfg["name"], "XYZ")
        self.assertEqual(cfg["address"], "XYZ")
        self.assertEqual(cfg["phone"], "XYZ")
        self.assertEqual(cfg["email"], "XYZ")

    def test_patient_bill_and_pdf_endpoints(self):
        """Test bill generation, stable invoice number, and A4 printable PDF generation."""
        # Create a patient
        create_res = self.client.post("/api/patients/", {
            "firstName": "KAMRUNBANU",
            "middleName": "ISRAIL",
            "lastName": "SHAH",
            "birthDate": "1956-01-01",
            "age": "70",
            "ageUnit": "Years",
            "sex": "Female",
            "hospitalDoctor": "Dr. DEVANG DESAI / JIGAR PATEL",
            "referenceBy": "DR. NIKUNJ VITHALANI",
            "mobile": "9825850725",
            "streetAddress": "SURAT",
            "city": "SURAT",
            "state": "GUJARAT",
        }, format="json")
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        uhid = create_res.data["patient"]["uhid"]

        # 1. Initially, no bill exists
        get_bill_res = self.client.get(f"/api/patients/{uhid}/bill/")
        self.assertEqual(get_bill_res.status_code, status.HTTP_404_NOT_FOUND)
        self.assertFalse(get_bill_res.data["exists"])

        # 2. Issue a bill
        issue_res = self.client.post(f"/api/patients/{uhid}/bill/", {
            "items": [
                {"srNo": 1, "details": "OPD Consultation / Registration Charge", "rate": 500.0, "amount": 500.0}
            ],
            "paymentType": "Cash",
            "amountReceived": 500.0,
        }, format="json")
        self.assertEqual(issue_res.status_code, status.HTTP_200_OK)
        bill_data = issue_res.data["bill"]
        invoice_no = bill_data["invoiceNo"]
        self.assertTrue(invoice_no.startswith("OPD"))
        self.assertEqual(bill_data["totalAmount"], 500.0)
        self.assertEqual(bill_data["amountReceived"], 500.0)
        self.assertEqual(bill_data["dueAmount"], 0.0)
        self.assertEqual(bill_data["patientName"], "KAMRUNBANU ISRAIL SHAH")

        # 3. Repeated POST or GET must return the identical bill with same invoiceNo
        re_post_res = self.client.post(f"/api/patients/{uhid}/bill/", format="json")
        self.assertEqual(re_post_res.status_code, status.HTTP_200_OK)
        self.assertEqual(re_post_res.data["bill"]["invoiceNo"], invoice_no)

        re_get_res = self.client.get(f"/api/patients/{uhid}/bill/")
        self.assertEqual(re_get_res.status_code, status.HTTP_200_OK)
        self.assertEqual(re_get_res.data["bill"]["invoiceNo"], invoice_no)

        # 4. Request PDF for this patient
        pdf_res = self.client.get(f"/api/patients/{uhid}/bill.pdf")
        self.assertEqual(pdf_res.status_code, status.HTTP_200_OK)
        self.assertEqual(pdf_res["Content-Type"], "application/pdf")
        self.assertTrue(pdf_res.content.startswith(b"%PDF-"))

        # 5. Non-existent patient returns 404
        bad_bill_res = self.client.get("/api/patients/NON-EXISTENT/bill.pdf")
        self.assertEqual(bad_bill_res.status_code, status.HTTP_404_NOT_FOUND)

    def test_charge_master_endpoint(self):
        """Test GET /api/charges/ returns configured active hospital charges."""
        res = self.client.get("/api/charges/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data["success"])
        charges = res.data["charges"]
        self.assertGreater(len(charges), 0)
        names = [c["name"] for c in charges]
        self.assertIn("Consultation Charge", names)
        self.assertIn("ECG / Diagnostic Procedure", names)

    def test_dynamic_multi_row_bill_calculation(self):
        """Test issuing bill with multiple dynamic charge rows and backend total recalculation."""
        create_res = self.client.post("/api/patients/", {
            "firstName": "RAHUL",
            "lastName": "VERMA",
            "birthDate": "1990-05-15",
            "age": "36",
            "sex": "Male",
            "hospitalDoctor": "Dr. NILESH MAHALE",
            "mobile": "9876543210",
        }, format="json")
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        uhid = create_res.data["patient"]["uhid"]

        # Issue bill with 3 dynamic charges
        issue_res = self.client.post(f"/api/patients/{uhid}/bill/", {
            "items": [
                {"details": "Consultation Charge"}, # Authoritative amount should be 500
                {"details": "ECG / Diagnostic Procedure"}, # Authoritative amount should be 350
                {"details": "Dressing / Nursing Charge"}, # Authoritative amount should be 200
            ],
            "paymentType": "UPI",
            "amountReceived": 1000.0,
            "forceNew": True
        }, format="json")
        self.assertEqual(issue_res.status_code, status.HTTP_200_OK)
        bill = issue_res.data["bill"]
        self.assertEqual(len(bill["items"]), 3)
        self.assertEqual(bill["items"][0]["amount"], 500.0)
        self.assertEqual(bill["items"][1]["amount"], 350.0)
        self.assertEqual(bill["items"][2]["amount"], 200.0)
        self.assertEqual(bill["totalAmount"], 1050.0)
        self.assertEqual(bill["amountReceived"], 1000.0)
        self.assertEqual(bill["dueAmount"], 50.0)

    def test_bill_discount_calculation_and_validation(self):
        """Test issuing bill with percentage discount and fixed discount, verifying net payable and PDF."""
        create_res = self.client.post("/api/patients/", {
            "firstName": "PRIYA",
            "lastName": "SHAH",
            "age": "29",
            "sex": "Female",
            "hospitalDoctor": "Dr. ASHOK PATEL",
            "mobile": "9876543211",
        }, format="json")
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        uhid = create_res.data["patient"]["uhid"]

        # 1. Percentage discount: Subtotal 1000, 10% discount -> 100 discount, net payable 900
        res = self.client.post(f"/api/patients/{uhid}/bill/", {
            "items": [
                {"details": "Consultation Charge", "rate": 500.0, "amount": 500.0},
                {"details": "Consultation Charge", "rate": 500.0, "amount": 500.0},
            ],
            "discountType": "percentage",
            "discountValue": 10.0,
            "discountDoctor": "Dr. ASHOK PATEL",
            "discountRemark": "Follow-up concession",
            "amountReceived": 800.0,
            "forceNew": True,
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        b = res.data["bill"]
        self.assertEqual(b["subtotal"], 1000.0)
        self.assertEqual(b["discountType"], "percentage")
        self.assertEqual(b["discountValue"], 10.0)
        self.assertEqual(b["discountAmount"], 100.0)
        self.assertEqual(b["discountDoctor"], "Dr. ASHOK PATEL")
        self.assertEqual(b["discountRemark"], "Follow-up concession")
        self.assertEqual(b["netPayable"], 900.0)
        self.assertEqual(b["totalAmount"], 900.0)
        self.assertEqual(b["amountReceived"], 800.0)
        self.assertEqual(b["dueAmount"], 100.0)

        # 2. Fixed discount: Subtotal 1000, 150 fixed discount -> net payable 850
        res2 = self.client.post(f"/api/patients/{uhid}/bill/", {
            "items": [
                {"details": "Consultation Charge", "rate": 500.0, "amount": 500.0},
                {"details": "Consultation Charge", "rate": 500.0, "amount": 500.0},
            ],
            "discountType": "fixed",
            "discountValue": 150.0,
            "discountDoctor": "Dr. ASHOK PATEL",
            "discountRemark": "Senior citizen flat discount",
            "amountReceived": 850.0,
            "forceNew": True,
        }, format="json")
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        b2 = res2.data["bill"]
        self.assertEqual(b2["subtotal"], 1000.0)
        self.assertEqual(b2["discountType"], "fixed")
        self.assertEqual(b2["discountValue"], 150.0)
        self.assertEqual(b2["discountAmount"], 150.0)
        self.assertEqual(b2["netPayable"], 850.0)
        self.assertEqual(b2["dueAmount"], 0.0)

    def test_persistent_invoice_numbering_never_restarts(self):
        """Test invoice sequence increments sequentially and never restarts across multiple bills."""
        # Create 3 distinct patients
        u1 = self.client.post("/api/patients/", {"firstName": "P1", "lastName": "T", "age": "20", "hospitalDoctor": "Dr. NILESH MAHALE", "mobile": "9800000001"}, format="json").data["patient"]["uhid"]
        u2 = self.client.post("/api/patients/", {"firstName": "P2", "lastName": "T", "age": "21", "hospitalDoctor": "Dr. NILESH MAHALE", "mobile": "9800000002"}, format="json").data["patient"]["uhid"]
        u3 = self.client.post("/api/patients/", {"firstName": "P3", "lastName": "T", "age": "22", "hospitalDoctor": "Dr. NILESH MAHALE", "mobile": "9800000003"}, format="json").data["patient"]["uhid"]

        b1 = self.client.post(f"/api/patients/{u1}/bill/", {"forceNew": True}, format="json").data["bill"]
        b2 = self.client.post(f"/api/patients/{u2}/bill/", {"forceNew": True}, format="json").data["bill"]
        b3 = self.client.post(f"/api/patients/{u3}/bill/", {"forceNew": True}, format="json").data["bill"]

        inv1 = b1["invoiceNo"]
        inv2 = b2["invoiceNo"]
        inv3 = b3["invoiceNo"]

        seq1 = int(inv1.split("/")[1])
        seq2 = int(inv2.split("/")[1])
        seq3 = int(inv3.split("/")[1])

        self.assertEqual(seq2, seq1 + 1)
        self.assertEqual(seq3, seq2 + 1)

        # Reopening patient 1's bill returns identical invoice number
        reopen_b1 = self.client.get(f"/api/patients/{u1}/bill/").data["bill"]
        self.assertEqual(reopen_b1["invoiceNo"], inv1)

        # Reprinting / updating patient 2's bill with updateExisting returns same invoice
        update_b2 = self.client.post(f"/api/patients/{u2}/bill/", {
            "discountType": "fixed",
            "discountValue": 50.0,
            "updateExisting": True,
            "forceNew": False
        }, format="json").data["bill"]
        self.assertEqual(update_b2["invoiceNo"], inv2)
        self.assertEqual(update_b2["discountAmount"], 50.0)






class DoctorMasterAPITests(SimpleTestCase):
    """
    Test suite for Doctor Master REST APIs and JSON storage.
    Uses isolated temporary storage.
    """

    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        self.temp_file = Path(self.temp_dir) / "test_doctors.json"

        from .doctor_storage import DoctorJSONStorage
        import patients.doctor_storage
        from . import views

        self.test_doctor_storage = DoctorJSONStorage(file_path=self.temp_file)
        self.orig_doctor_storage = patients.doctor_storage.doctor_storage
        patients.doctor_storage.doctor_storage = self.test_doctor_storage
        views.doctor_storage = self.test_doctor_storage

        self.client = APIClient()

    def tearDown(self):
        import patients.doctor_storage
        from . import views
        patients.doctor_storage.doctor_storage = self.orig_doctor_storage
        views.doctor_storage = self.orig_doctor_storage
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    def test_get_doctors_list(self):
        """Test retrieving seeded doctor list."""
        res = self.client.get("/api/doctors/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data["success"])
        self.assertGreaterEqual(res.data["count"], 5)

    def test_search_doctor_by_name_and_speciality(self):
        """Test searching doctors by name or speciality."""
        res = self.client.get("/api/doctors/?search=Mahale")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        names = [d["drName"] for d in res.data["doctors"]]
        self.assertTrue(any("Nilesh" in n for n in names))

        res_spec = self.client.get("/api/doctors/?speciality=Cardiology")
        self.assertEqual(res_spec.status_code, status.HTTP_200_OK)
        for d in res_spec.data["doctors"]:
            self.assertEqual(d["speciality"].lower(), "cardiology")

    def test_create_doctor_success(self):
        """Test creating a new doctor with valid data."""
        payload = {
            "drHosRef": "Hospital Doctor",
            "drType": "Pediatrician",
            "title": "Dr.",
            "drName": "Rajesh Sharma",
            "degree": "MBBS, MD (Pediatrics)",
            "speciality": "Pediatrics",
            "department": "Pediatrics",
            "drRegNo": "G-55123",
            "mobileNo": "9825998877",
            "email": "dr.rajesh@hospital.com",
            "consultationFee": 400.0,
            "city": "SURAT",
            "state": "GUJARAT",
            "status": "active"
        }
        res = self.client.post("/api/doctors/", payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res.data["success"])
        doc = res.data["doctor"]
        self.assertEqual(doc["drName"], "Rajesh Sharma")
        self.assertTrue(doc["id"].startswith("DR-"))

    def test_create_doctor_validation_errors(self):
        """Test validation rejects invalid mobile and empty name."""
        payload = {
            "drName": " ",
            "mobileNo": "123",  # Invalid mobile length
        }
        res = self.client.post("/api/doctors/", payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("drName", res.data["details"])
        self.assertIn("mobileNo", res.data["details"])

    def test_update_doctor(self):
        """Test updating an existing doctor."""
        res = self.client.get("/api/doctors/")
        first_doc = res.data["doctors"][0]
        doc_id = first_doc["id"]

        update_payload = {"consultationFee": 950.0, "speciality": "Advanced Medicine"}
        up_res = self.client.patch(f"/api/doctors/{doc_id}/", update_payload, format="json")
        self.assertEqual(up_res.status_code, status.HTTP_200_OK)
        self.assertEqual(up_res.data["doctor"]["consultationFee"], 950.0)
        self.assertEqual(up_res.data["doctor"]["speciality"], "Advanced Medicine")

    def test_deactivate_doctor(self):
        """Test deactivating a doctor marks status as inactive."""
        res = self.client.get("/api/doctors/")
        first_doc = res.data["doctors"][0]
        doc_id = first_doc["id"]

        del_res = self.client.delete(f"/api/doctors/{doc_id}/")
        self.assertEqual(del_res.status_code, status.HTTP_200_OK)
        self.assertEqual(del_res.data["action"], "deactivated")

        # Verify doctor is now inactive
        chk_res = self.client.get(f"/api/doctors/{doc_id}/")
        self.assertEqual(chk_res.data["doctor"]["status"], "inactive")


class MedicineMasterAPITests(SimpleTestCase):
    """
    Test suite for Medicine Master REST APIs and JSON storage.
    Uses isolated temporary storage.
    """

    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        self.temp_file = Path(self.temp_dir) / "test_medicines.json"

        from .medicine_storage import MedicineJSONStorage
        import patients.medicine_storage
        from . import views

        self.test_medicine_storage = MedicineJSONStorage(file_path=self.temp_file)
        self.orig_medicine_storage = patients.medicine_storage.medicine_storage
        patients.medicine_storage.medicine_storage = self.test_medicine_storage
        views.medicine_storage = self.test_medicine_storage

        self.client = APIClient()

    def tearDown(self):
        import patients.medicine_storage
        from . import views
        patients.medicine_storage.medicine_storage = self.orig_medicine_storage
        views.medicine_storage = self.orig_medicine_storage
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    def test_get_medicines_list(self):
        """Test retrieving seeded medicine list."""
        res = self.client.get("/api/medicines/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data["success"])
        self.assertGreaterEqual(res.data["count"], 5)

    def test_search_medicine_by_brand_and_generic(self):
        """Test searching medicines by brand name or generic name."""
        res = self.client.get("/api/medicines/?search=Dolo")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(len(res.data["medicines"]) >= 1)

        res_gen = self.client.get("/api/medicines/?search=Amoxicillin")
        self.assertEqual(res_gen.status_code, status.HTTP_200_OK)
        self.assertTrue(len(res_gen.data["medicines"]) >= 1)

    def test_create_medicine_success(self):
        """Test creating a new medicine."""
        payload = {
            "brandName": "Metpure XL 25",
            "genericName": "Metoprolol Succinate",
            "medicineGroup": "Cardiovascular",
            "dosageForm": "Tablet",
            "strength": "25 mg",
            "frequency": "0-1-0",
            "sellingPrice": 85.0,
            "purchasePrice": 55.0,
            "stockQty": 200,
            "status": "active"
        }
        res = self.client.post("/api/medicines/", payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res.data["success"])
        med = res.data["medicine"]
        self.assertEqual(med["brandName"], "Metpure XL 25")
        self.assertTrue(med["id"].startswith("MED-"))

    def test_create_medicine_validation_negative_values(self):
        """Test validation prevents negative prices and negative stock."""
        payload = {
            "brandName": "Test Drug",
            "genericName": "Generic Test",
            "sellingPrice": -10.0,
            "stockQty": -5
        }
        res = self.client.post("/api/medicines/", payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("sellingPrice", res.data["details"])
        self.assertIn("stockQty", res.data["details"])

    def test_update_and_deactivate_medicine(self):
        """Test updating stock and deactivating medicine."""
        res = self.client.get("/api/medicines/")
        first_med = res.data["medicines"][0]
        med_id = first_med["id"]

        up_res = self.client.patch(f"/api/medicines/{med_id}/", {"stockQty": 999}, format="json")
        self.assertEqual(up_res.status_code, status.HTTP_200_OK)
        self.assertEqual(up_res.data["medicine"]["stockQty"], 999)

        del_res = self.client.delete(f"/api/medicines/{med_id}/")
        self.assertEqual(del_res.status_code, status.HTTP_200_OK)
        self.assertEqual(del_res.data["action"], "deactivated")


class ReportTemplateAPITests(SimpleTestCase):
    """
    Test suite for Report Template REST APIs and JSON storage.
    Uses isolated temporary storage.
    """

    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        self.temp_file = Path(self.temp_dir) / "test_report_templates.json"

        from .report_template_storage import ReportTemplateJSONStorage
        import patients.report_template_storage
        from . import views

        self.test_template_storage = ReportTemplateJSONStorage(file_path=self.temp_file)
        self.orig_template_storage = patients.report_template_storage.report_template_storage
        patients.report_template_storage.report_template_storage = self.test_template_storage
        views.report_template_storage = self.test_template_storage

        self.client = APIClient()

    def tearDown(self):
        import patients.report_template_storage
        from . import views
        patients.report_template_storage.report_template_storage = self.orig_template_storage
        views.report_template_storage = self.orig_template_storage
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    def test_get_templates_list(self):
        """Test retrieving seeded report templates."""
        res = self.client.get("/api/report-templates/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data["success"])
        self.assertGreaterEqual(res.data["count"], 5)

    def test_search_template_by_name(self):
        """Test searching templates by name."""
        res = self.client.get("/api/report-templates/?search=Doppler")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(len(res.data["templates"]) >= 1)
        self.assertIn("COLOR DOPPLER", res.data["templates"][0]["templateName"])

    def test_create_template_success(self):
        """Test creating a new template."""
        payload = {
            "groupName": "Sonography",
            "templateName": "KUB & PELVIS ULTRASOUND",
            "reportHeader": "ULTRASOUND EXAMINATION OF KUB & PELVIS",
            "department": "Radiology",
            "details": "Both kidneys normal. Bladder normal. No calculus.",
            "status": "active"
        }
        res = self.client.post("/api/report-templates/", payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res.data["success"])
        tpl = res.data["template"]
        self.assertEqual(tpl["templateName"], "KUB & PELVIS ULTRASOUND")
        self.assertTrue(tpl["id"].startswith("TPL-"))

    def test_create_template_validation_empty_details(self):
        """Test validation rejects empty details."""
        payload = {
            "groupName": "Sonography",
            "templateName": "Test Template",
            "details": "   "
        }
        res = self.client.post("/api/report-templates/", payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("details", res.data["details"])

    def test_update_and_deactivate_template(self):
        """Test updating template header and deactivating it."""
        res = self.client.get("/api/report-templates/")
        first_tpl = res.data["templates"][0]
        tpl_id = first_tpl["id"]

        up_res = self.client.patch(f"/api/report-templates/{tpl_id}/", {"reportHeader": "UPDATED HEADER"}, format="json")
        self.assertEqual(up_res.status_code, status.HTTP_200_OK)
        self.assertEqual(up_res.data["template"]["reportHeader"], "UPDATED HEADER")

        del_res = self.client.delete(f"/api/report-templates/{tpl_id}/")
        self.assertEqual(del_res.status_code, status.HTTP_200_OK)
        self.assertEqual(del_res.data["action"], "deactivated")


class EchoReportModuleAPITests(SimpleTestCase):
    """
    Test suite for Echo (Echocardiography) Report JSON storage and REST API endpoints.
    Uses isolated temporary storage files to ensure test isolation.
    """

    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        self.temp_patients_file = Path(self.temp_dir) / "test_patients.json"
        self.temp_echo_file = Path(self.temp_dir) / "test_echo_reports.json"

        # Create a test patient storage and seed a patient
        from .storage import PatientJSONStorage
        self.patient_storage = PatientJSONStorage(file_path=self.temp_patients_file)
        self.test_patient = self.patient_storage.create({
            "firstName": "Sanjay",
            "lastName": "Patel",
            "age": "45",
            "sex": "Male",
            "mobile": "9825012345",
            "hospitalDoctor": "Dr. Nilesh Mahale",
            "referenceBy": "DR. NIKUNJ VITHALANI"
        })

        # Initialize Echo Report storage with custom file
        from .echo_report_storage import EchoReportJSONStorage
        self.echo_storage = EchoReportJSONStorage(file_path=self.temp_echo_file)
        self.echo_storage.patient_storage = self.patient_storage

        # Patch the views' storage instance
        from . import views
        self.orig_echo_storage = views.echo_report_storage
        views.echo_report_storage = self.echo_storage

        self.client = APIClient()

    def tearDown(self):
        from . import views
        views.echo_report_storage = self.orig_echo_storage
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    def test_list_echo_reports(self):
        """Test GET /api/echo-reports/ returns seeded reports."""
        res = self.client.get("/api/echo-reports/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data["success"])
        self.assertGreaterEqual(res.data["count"], 2)

    def test_create_echo_report_success(self):
        """Test POST /api/echo-reports/ creates report for existing patient."""
        payload = {
            "uhid": self.test_patient["uhid"],
            "reportDate": "2026-11-03",
            "referredBy": "DR. NIKUNJ VITHALANI",
            "c_o": "Dyspnea on moderate exertion",
            "mitralValve": "Normal",
            "aorticValve": "Normal",
            "lvef": "60%",
            "septum": "10",
            "pWall": "9",
            "lvidd": "48",
            "lvids": "31",
            "dopplerStudy": "Normal diastolic filling",
            "conclusion": "Normal study. Preserved ejection fraction.",
            "consultantDr": "Dr. Nilesh Mahale",
            "status": "Draft"
        }
        res = self.client.post("/api/echo-reports/", payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res.data["success"])
        rep = res.data["report"]
        self.assertEqual(rep["uhid"], self.test_patient["uhid"])
        self.assertEqual(rep["patientName"], "Sanjay Patel")
        self.assertEqual(rep["lvef"], 60)
        self.assertEqual(rep["status"], "Draft")
        self.assertTrue(rep["id"].startswith("ECHO-"))

    def test_create_echo_report_fails_for_nonexistent_patient(self):
        """Test creating report for unknown patient is rejected."""
        payload = {
            "uhid": "UHID-9999",
            "conclusion": "Should fail because patient does not exist"
        }
        res = self.client.post("/api/echo-reports/", payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(res.data["success"])
        self.assertIn("does not exist", res.data["error"])

    def test_update_draft_echo_report(self):
        """Test updating fields on a draft report."""
        # Create draft first
        created = self.echo_storage.create({
            "uhid": self.test_patient["uhid"],
            "conclusion": "Initial impression",
            "status": "Draft"
        })
        rep_id = created["id"]

        up_res = self.client.put(
            f"/api/echo-reports/{rep_id}/",
            {"conclusion": "Updated revised impression", "lvef": "65%"},
            format="json"
        )
        self.assertEqual(up_res.status_code, status.HTTP_200_OK)
        self.assertEqual(up_res.data["report"]["conclusion"], "Updated revised impression")
        self.assertEqual(up_res.data["report"]["lvef"], 65)

    def test_finalize_report_locks_editing(self):
        """Test finalization locks report from accidental editing."""
        created = self.echo_storage.create({
            "uhid": self.test_patient["uhid"],
            "conclusion": "Final finding",
            "status": "Draft"
        })
        rep_id = created["id"]

        # Finalize
        fin_res = self.client.post(f"/api/echo-reports/{rep_id}/finalize/", {"finalizedBy": "Dr. Nilesh Mahale"}, format="json")
        self.assertEqual(fin_res.status_code, status.HTTP_200_OK)
        self.assertEqual(fin_res.data["report"]["status"], "Finalized")
        self.assertIsNotNone(fin_res.data["report"]["finalizedAt"])

        # Attempt edit without amendment flag -> should fail
        err_res = self.client.put(f"/api/echo-reports/{rep_id}/", {"conclusion": "Accidental edit"}, format="json")
        self.assertEqual(err_res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("locked from modification", err_res.data["error"])

        # Edit with explicit allow_finalized_edit -> should succeed
        ok_res = self.client.put(
            f"/api/echo-reports/{rep_id}/",
            {"conclusion": "Authorized amendment", "allow_finalized_edit": True},
            format="json"
        )
        self.assertEqual(ok_res.status_code, status.HTTP_200_OK)
        self.assertEqual(ok_res.data["report"]["conclusion"], "Authorized amendment")

    def test_delete_echo_report(self):
        """Test deleting an echo report."""
        created = self.echo_storage.create({
            "uhid": self.test_patient["uhid"],
            "status": "Draft"
        })
        rep_id = created["id"]

        del_res = self.client.delete(f"/api/echo-reports/{rep_id}/")
        self.assertEqual(del_res.status_code, status.HTTP_200_OK)
        self.assertTrue(del_res.data["success"])

        # Check it is gone
        get_res = self.client.get(f"/api/echo-reports/{rep_id}/")
        self.assertEqual(get_res.status_code, status.HTTP_404_NOT_FOUND)


class DomainRepositoriesAndWorkflowsTestCase(SimpleTestCase):
    """
    Test suite for relational domain repositories, IPD admissions,
    bed occupancy tracking, discharges, returning patient visits, and certificates.
    """

    def setUp(self):
        self.client = APIClient()

    def test_department_crud(self):
        """Test department listing, creation, and search."""
        res = self.client.get("/api/departments/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreater(len(res.data["departments"]), 0)

        # Create new department
        new_dep = {
            "name": "Neurology",
            "code": "NEURO",
            "head_doctor": "Dr. Nilesh Mahale",
            "extension": "108"
        }
        create_res = self.client.post("/api/departments/", new_dep, format="json")
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        dep_id = create_res.data["item"]["id"]
        self.assertTrue(dep_id.startswith("DEP-"))

        # Search for created department
        search_res = self.client.get("/api/departments/?search=Neurology")
        self.assertEqual(search_res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(search_res.data["departments"]), 1)
        self.assertEqual(search_res.data["departments"][0]["code"], "NEURO")

    def test_bed_allocation_and_release(self):
        """Test bed allocation and release lifecycle."""
        # Check initial vacant beds
        beds_res = self.client.get("/api/beds/")
        self.assertEqual(beds_res.status_code, status.HTTP_200_OK)
        self.assertGreater(len(beds_res.data["beds"]), 0)

        # Allocate bed
        alloc_res = self.client.post("/api/beds/GEN-02/allocate/", {"admission_id": "ADM-TEST-01", "patient_id": "UHID-1022"}, format="json")
        self.assertEqual(alloc_res.status_code, status.HTTP_200_OK)
        self.assertEqual(alloc_res.data["bed"]["status"], "Occupied")

        # Release bed
        rel_res = self.client.post("/api/beds/GEN-02/release/", format="json")
        self.assertEqual(rel_res.status_code, status.HTTP_200_OK)
        self.assertEqual(rel_res.data["bed"]["status"], "Vacant")

    def test_admission_and_discharge_lifecycle(self):
        """Test patient admission occupies bed and discharge frees the bed."""
        # 1. Admit patient
        admission_payload = {
            "uhid": "UHID-1023",
            "patient_name": "TestBillPatient",
            "age": "33",
            "gender": "Male",
            "bed_number": "SEMI-102",
            "ward_name": "1st Floor East",
            "room_type": "Semi-Private Room",
            "admitting_doctor": "Dr. Nilesh Mahale",
            "provisional_diagnosis": "Dengue Fever with thrombocytopenia",
            "initial_deposit": 10000.0,
        }
        adm_res = self.client.post("/api/admissions/", admission_payload, format="json")
        self.assertEqual(adm_res.status_code, status.HTTP_201_CREATED)
        admission = adm_res.data["admission"]
        adm_id = admission["id"]
        ipd_no = admission["ipd_no"]
        self.assertTrue(ipd_no.startswith("IPD-2026-"))

        # Verify bed is marked Occupied
        bed_check = self.client.get("/api/beds/?search=SEMI-102")
        self.assertEqual(bed_check.status_code, status.HTTP_200_OK)
        self.assertEqual(bed_check.data["beds"][0]["status"], "Occupied")

        # 2. Discharge patient
        discharge_payload = {
            "admission_id": adm_id,
            "ipd_no": ipd_no,
            "uhid": "UHID-1023",
            "patient_name": "TestBillPatient",
            "bed_number": "SEMI-102",
            "final_diagnosis": "Dengue Fever - Recovered",
            "condition_on_discharge": "Recovered",
            "treatment_summary": "IV fluids, antipyretics, platelet monitoring",
            "discharging_doctor_name": "Dr. Nilesh Mahale",
        }
        dis_res = self.client.post("/api/discharges/", discharge_payload, format="json")
        self.assertEqual(dis_res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(dis_res.data["discharge"]["discharge_no"].startswith("DIS-2026-"))

        # Verify bed is automatically marked Vacant
        bed_check2 = self.client.get("/api/beds/?search=SEMI-102")
        self.assertEqual(bed_check2.data["beds"][0]["status"], "Vacant")

    def test_returning_patient_longitudinal_visits(self):
        """Test returning patient can record multiple visits linked to same UHID."""
        uhid = "UHID-1023"
        # Record visit 2
        visit_payload = {
            "patient_name": "TestBillPatient",
            "doctor": "Dr. Nilesh Mahale",
            "visit_type": "Follow-up Consultation",
            "chief_complaint": "Follow-up post fever, no active symptoms",
            "vitals": {"bp": "120/80", "pulse": "72", "temp": "98.2"}
        }
        vis_res = self.client.post(f"/api/patients/{uhid}/visits/", visit_payload, format="json")
        self.assertEqual(vis_res.status_code, status.HTTP_201_CREATED)
        new_visit = vis_res.data["visit"]
        self.assertEqual(new_visit["uhid"], uhid)
        self.assertGreaterEqual(new_visit["visit_no"], 2)

        # Retrieve visits for patient
        get_visits = self.client.get(f"/api/patients/{uhid}/visits/")
        self.assertEqual(get_visits.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(get_visits.data["count"], 2)

    def test_investigation_and_certificate_records(self):
        """Test creating and retrieving lab investigation orders and medical certificates."""
        # Lab investigation
        inv_payload = {
            "uhid": "UHID-1023",
            "patient_name": "TestBillPatient",
            "doctor_name": "Dr. Nilesh Mahale",
            "test_name": "Serum Creatinine",
            "category": "Biochemistry",
            "sample_status": "Processing",
            "lab_id": "LAB-201",
        }
        inv_res = self.client.post("/api/investigations/", inv_payload, format="json")
        self.assertEqual(inv_res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(inv_res.data["item"]["id"].startswith("INV-"))

        # Medical Certificate
        cert_payload = {
            "cert_type": "MEDICAL",
            "uhid": "UHID-1023",
            "patient_name": "TestBillPatient",
            "age": "33",
            "gender": "Male",
            "diagnosis": "Viral Pyrexia",
            "rest_from": "2026-11-12",
            "rest_to": "2026-11-15",
            "doctor_name": "Dr. Nilesh Mahale",
        }
        cert_res = self.client.post("/api/certificates/", cert_payload, format="json")
        self.assertEqual(cert_res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(cert_res.data["item"]["id"].startswith("CERT-"))


