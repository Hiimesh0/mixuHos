from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .storage import storage, StorageError
from .serializers import PatientSerializer


class PatientListCreateView(APIView):
    """
    GET  /api/patients/ - List patients with optional instant search and filtering
    POST /api/patients/ - Register a new patient
    """

    def get(self, request):
        try:
            search = request.query_params.get("search", None)
            gender = request.query_params.get("gender", None)
            category = request.query_params.get("category", None)
            doctor = request.query_params.get("doctor", None)
            city = request.query_params.get("city", None)

            patients = storage.get_all(
                search=search,
                gender=gender,
                category=category,
                doctor=doctor,
                city=city,
            )
            return Response(
                {
                    "success": True,
                    "count": len(patients),
                    "patients": patients,
                },
                status=status.HTTP_200_OK,
            )
        except StorageError as exc:
            return Response(
                {"success": False, "error": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request):
        serializer = PatientSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "error": "Validation failed",
                    "details": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            patient = storage.create(serializer.validated_data)
            return Response(
                {
                    "success": True,
                    "message": f"Patient {patient.get('firstName')} registered successfully with {patient.get('uhid')}!",
                    "patient": patient,
                },
                status=status.HTTP_201_CREATED,
            )
        except StorageError as exc:
            return Response(
                {"success": False, "error": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class PatientDetailView(APIView):
    """
    GET    /api/patients/<patient_id>/ - Retrieve single patient record
    PUT    /api/patients/<patient_id>/ - Update an existing patient record
    PATCH  /api/patients/<patient_id>/ - Partial update an existing patient record
    DELETE /api/patients/<patient_id>/ - Delete an existing patient record
    """

    def get(self, request, patient_id):
        try:
            patient = storage.get_by_id(patient_id)
            if not patient:
                return Response(
                    {"success": False, "error": f"Patient '{patient_id}' not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )
            return Response({"success": True, "patient": patient}, status=status.HTTP_200_OK)
        except StorageError as exc:
            return Response(
                {"success": False, "error": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def put(self, request, patient_id):
        serializer = PatientSerializer(data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "error": "Validation failed",
                    "details": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            updated = storage.update(patient_id, serializer.validated_data)
            if not updated:
                return Response(
                    {"success": False, "error": f"Patient '{patient_id}' not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )
            return Response(
                {
                    "success": True,
                    "message": f"Patient {updated.get('uhid')} updated successfully.",
                    "patient": updated,
                },
                status=status.HTTP_200_OK,
            )
        except StorageError as exc:
            return Response(
                {"success": False, "error": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def patch(self, request, patient_id):
        return self.put(request, patient_id)

    def delete(self, request, patient_id):
        try:
            deleted = storage.delete(patient_id)
            if not deleted:
                return Response(
                    {"success": False, "error": f"Patient '{patient_id}' not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )
            return Response(
                {"success": True, "message": f"Patient '{patient_id}' deleted successfully."},
                status=status.HTTP_200_OK,
            )
        except StorageError as exc:
            return Response(
                {"success": False, "error": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class PatientStickerPdfView(APIView):
    """
    GET /api/patients/<patient_id>/sticker.pdf
    GET /api/patients/<patient_id>/sticker/
    Generate and stream a 100mm x 50mm PDF patient sticker.
    """

    def get(self, request, patient_id):
        from django.http import HttpResponse
        from .sticker_pdf import generate_patient_sticker_pdf

        try:
            patient = storage.get_by_id(patient_id)
            if not patient:
                return Response(
                    {"success": False, "error": f"Patient '{patient_id}' not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            pdf_bytes = generate_patient_sticker_pdf(patient)
            uhid = patient.get("uhid") or patient.get("id") or patient_id

            response = HttpResponse(pdf_bytes, content_type="application/pdf")
            response["Content-Disposition"] = f'inline; filename="Patient_Sticker_{uhid}.pdf"'
            response["Cache-Control"] = "no-cache, no-store, must-revalidate"
            return response
        except StorageError as exc:
            return Response(
                {"success": False, "error": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception as exc:
            return Response(
                {"success": False, "error": f"Failed to generate sticker PDF: {str(exc)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class PatientBillView(APIView):
    """
    GET  /api/patients/<patient_id>/bill/ - Retrieve bill for a patient
    POST /api/patients/<patient_id>/bill/ - Create or retrieve existing bill without duplicate invoice creation
    """

    def get(self, request, patient_id):
        from .bill_storage import bill_storage, BillStorageError

        try:
            patient = storage.get_by_id(patient_id)
            if not patient:
                return Response(
                    {"success": False, "error": f"Patient '{patient_id}' not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            bill = bill_storage.get_by_patient_id(patient_id)
            if not bill:
                return Response(
                    {
                        "success": False,
                        "exists": False,
                        "error": f"No bill has been issued yet for patient '{patient_id}'.",
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )

            return Response({"success": True, "exists": True, "bill": bill}, status=status.HTTP_200_OK)
        except BillStorageError as exc:
            return Response(
                {"success": False, "error": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request, patient_id):
        from .bill_storage import bill_storage, BillStorageError

        try:
            patient = storage.get_by_id(patient_id)
            if not patient:
                return Response(
                    {"success": False, "error": f"Patient '{patient_id}' not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            items = request.data.get("items")
            payment_type = request.data.get("paymentType", "Cash")
            amount_received = request.data.get("amountReceived", None)
            discount_type = request.data.get("discountType", "percentage")
            discount_value = request.data.get("discountValue", 0.0)
            discount_doctor = request.data.get("discountDoctor", "")
            discount_remark = request.data.get("discountRemark", "")
            entry_by = request.data.get("entryBy", "Jenil Bundela")
            pc_name = request.data.get("pcName", "RECEPTION1")
            force_new = bool(request.data.get("forceNew", False))
            update_existing = bool(request.data.get("updateExisting", False))

            bill = bill_storage.create_or_get_bill(
                patient=patient,
                items=items,
                payment_type=payment_type,
                amount_received=amount_received,
                discount_type=discount_type,
                discount_value=discount_value,
                discount_doctor=discount_doctor,
                discount_remark=discount_remark,
                entry_by=entry_by,
                pc_name=pc_name,
                force_new=force_new,
                update_existing=update_existing,
            )

            return Response(
                {
                    "success": True,
                    "message": f"Bill {bill.get('invoiceNo')} retrieved/generated successfully.",
                    "bill": bill,
                },
                status=status.HTTP_200_OK,
            )
        except BillStorageError as exc:
            return Response(
                {"success": False, "error": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class BillsListView(APIView):
    """
    GET  /api/bills/ - List all hospital billing encounters (optionally filtered by ?patient_id=UHID-1001)
    POST /api/bills/ - Save, create or update a patient bill (OPD or IPD)
    """

    def get(self, request):
        from .bill_storage import bill_storage, BillStorageError

        try:
            patient_id = request.query_params.get("patient_id") or request.query_params.get("uhid")
            bills = bill_storage.get_all(patient_id=patient_id)
            return Response(
                {
                    "success": True,
                    "count": len(bills),
                    "bills": bills,
                },
                status=status.HTTP_200_OK,
            )
        except BillStorageError as exc:
            return Response(
                {"success": False, "error": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request):
        from .bill_storage import bill_storage, BillStorageError

        try:
            bill_data = request.data
            if not bill_data or not isinstance(bill_data, dict):
                return Response(
                    {"success": False, "error": "Invalid bill data payload."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            patient_id = bill_data.get("patientId") or bill_data.get("uhid")
            if not patient_id:
                return Response(
                    {"success": False, "error": "Patient UHID is required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            saved_bill = bill_storage.save_bill(bill_data)
            return Response(
                {
                    "success": True,
                    "bill": saved_bill,
                },
                status=status.HTTP_201_CREATED,
            )
        except BillStorageError as exc:
            return Response(
                {"success": False, "error": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as exc:
            return Response(
                {"success": False, "error": f"Failed to persist bill: {str(exc)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class PatientBillPdfView(APIView):
    """
    GET /api/patients/<patient_id>/bill.pdf
    GET /api/patients/<patient_id>/bill/pdf/
    Generate and stream an A4 Portrait PDF bill receipt matching Bill.jpeg reference.
    """

    def get(self, request, patient_id):
        from django.http import HttpResponse
        from .bill_storage import bill_storage, BillStorageError
        from .bill_pdf import generate_patient_bill_pdf

        try:
            patient = storage.get_by_id(patient_id)
            if not patient:
                return Response(
                    {"success": False, "error": f"Patient '{patient_id}' not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Retrieve existing bill or create one if none exists
            bill = bill_storage.get_by_patient_id(patient_id)
            if not bill:
                bill = bill_storage.create_or_get_bill(patient=patient)

            pdf_bytes = generate_patient_bill_pdf(bill)
            inv_clean = (bill.get("invoiceNo") or "Bill").replace("/", "_")

            response = HttpResponse(pdf_bytes, content_type="application/pdf")
            response["Content-Disposition"] = f'inline; filename="Bill_{inv_clean}.pdf"'
            response["Cache-Control"] = "no-cache, no-store, must-revalidate"
            return response
        except (StorageError, BillStorageError) as exc:
            return Response(
                {"success": False, "error": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception as exc:
            return Response(
                {"success": False, "error": f"Failed to generate bill PDF: {str(exc)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class HospitalConfigView(APIView):
    """
    GET /api/hospital/config/
    Return the centralized hospital configuration (name, address, phone, email, etc.).
    """

    def get(self, request):
        from config.hospital_config import get_hospital_config
        return Response({"success": True, "config": get_hospital_config()}, status=status.HTTP_200_OK)


class ChargeMasterView(APIView):
    """
    GET /api/charges/
    Return active charge types and authoritative amounts from charge_master.json.
    """

    def get(self, request):
        from .charge_storage import charge_storage, ChargeStorageError
        try:
            charges = charge_storage.get_all(active_only=True)
            return Response({"success": True, "charges": charges}, status=status.HTTP_200_OK)
        except ChargeStorageError as exc:
            return Response({"success": False, "error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)






# ============================================================================
# Doctor Master Views
# ============================================================================

from .doctor_storage import doctor_storage, DoctorStorageError
from .serializers import DoctorSerializer


class DoctorListCreateView(APIView):
    """
    GET  /api/doctors/ - List doctors with search and filtering
    POST /api/doctors/ - Create a new doctor record
    """

    def get(self, request):
        try:
            search = request.query_params.get("search", None)
            speciality = request.query_params.get("speciality", None)
            department = request.query_params.get("department", None)
            active_param = request.query_params.get("active_only", "false").lower()
            active_only = active_param in ("true", "1", "yes")

            doctors = doctor_storage.get_all(
                active_only=active_only,
                query=search,
                speciality=speciality,
                department=department
            )
            return Response(
                {
                    "success": True,
                    "count": len(doctors),
                    "doctors": doctors,
                },
                status=status.HTTP_200_OK,
            )
        except DoctorStorageError as exc:
            return Response(
                {"success": False, "error": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request):
        serializer = DoctorSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "error": "Validation failed",
                    "details": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            created = doctor_storage.create(serializer.validated_data)
            return Response(
                {
                    "success": True,
                    "message": f"Doctor {created.get('drName')} created successfully.",
                    "doctor": created,
                },
                status=status.HTTP_201_CREATED,
            )
        except DoctorStorageError as exc:
            return Response(
                {"success": False, "error": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class DoctorDetailView(APIView):
    """
    GET    /api/doctors/<doctor_id>/ - Retrieve single doctor
    PUT    /api/doctors/<doctor_id>/ - Full update
    PATCH  /api/doctors/<doctor_id>/ - Partial update
    DELETE /api/doctors/<doctor_id>/ - Deactivate or delete doctor
    """

    def get(self, request, doctor_id):
        doc = doctor_storage.get_by_id(doctor_id)
        if not doc:
            return Response(
                {"success": False, "error": f"Doctor '{doctor_id}' not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response({"success": True, "doctor": doc}, status=status.HTTP_200_OK)

    def put(self, request, doctor_id):
        return self._update(request, doctor_id, partial=False)

    def patch(self, request, doctor_id):
        return self._update(request, doctor_id, partial=True)

    def _update(self, request, doctor_id, partial=False):
        doc = doctor_storage.get_by_id(doctor_id)
        if not doc:
            return Response(
                {"success": False, "error": f"Doctor '{doctor_id}' not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = DoctorSerializer(data=request.data, partial=partial)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "error": "Validation failed",
                    "details": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            updated = doctor_storage.update(doctor_id, serializer.validated_data)
            return Response(
                {
                    "success": True,
                    "message": f"Doctor '{doctor_id}' updated successfully.",
                    "doctor": updated,
                },
                status=status.HTTP_200_OK,
            )
        except DoctorStorageError as exc:
            return Response(
                {"success": False, "error": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def delete(self, request, doctor_id):
        doc = doctor_storage.get_by_id(doctor_id)
        if not doc:
            return Response(
                {"success": False, "error": f"Doctor '{doctor_id}' not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        force = request.query_params.get("force", "false").lower() in ("true", "1")
        # Check if doctor is referenced in patient registrations or bills
        if force:
            doc_name = doc.get("drName", "").lower()
            patients = storage.get_all()
            is_referenced = any(
                doc_name in str(p.get("hospitalDoctor", "")).lower() or
                doc_name in str(p.get("referenceBy", "")).lower()
                for p in patients
            )
            if is_referenced:
                # Disallow permanent delete when referenced; enforce deactivation
                force = False

        result = doctor_storage.delete_or_deactivate(doctor_id, force_delete=force)
        return Response(
            {
                "success": True,
                "message": (
                    f"Doctor '{doctor_id}' deactivated to preserve historical clinical records."
                    if result.get("action") == "deactivated"
                    else f"Doctor '{doctor_id}' deleted successfully."
                ),
                **result,
            },
            status=status.HTTP_200_OK,
        )


# ============================================================================
# Medicine Master Views
# ============================================================================

from .medicine_storage import medicine_storage, MedicineStorageError
from .serializers import MedicineSerializer


class MedicineListCreateView(APIView):
    """
    GET  /api/medicines/ - List medicines with search and filtering
    POST /api/medicines/ - Create a new medicine record
    """

    def get(self, request):
        try:
            search = request.query_params.get("search", None)
            group = request.query_params.get("group", None)
            dosage_form = request.query_params.get("dosage_form", None)
            active_param = request.query_params.get("active_only", "false").lower()
            active_only = active_param in ("true", "1", "yes")

            medicines = medicine_storage.get_all(
                active_only=active_only,
                query=search,
                group=group,
                dosage_form=dosage_form
            )
            return Response(
                {
                    "success": True,
                    "count": len(medicines),
                    "medicines": medicines,
                },
                status=status.HTTP_200_OK,
            )
        except MedicineStorageError as exc:
            return Response(
                {"success": False, "error": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request):
        serializer = MedicineSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "error": "Validation failed",
                    "details": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            created = medicine_storage.create(serializer.validated_data)
            return Response(
                {
                    "success": True,
                    "message": f"Medicine {created.get('brandName')} created successfully.",
                    "medicine": created,
                },
                status=status.HTTP_201_CREATED,
            )
        except MedicineStorageError as exc:
            return Response(
                {"success": False, "error": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class MedicineDetailView(APIView):
    """
    GET    /api/medicines/<medicine_id>/ - Retrieve single medicine
    PUT    /api/medicines/<medicine_id>/ - Full update
    PATCH  /api/medicines/<medicine_id>/ - Partial update
    DELETE /api/medicines/<medicine_id>/ - Deactivate or delete medicine
    """

    def get(self, request, medicine_id):
        med = medicine_storage.get_by_id(medicine_id)
        if not med:
            return Response(
                {"success": False, "error": f"Medicine '{medicine_id}' not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response({"success": True, "medicine": med}, status=status.HTTP_200_OK)

    def put(self, request, medicine_id):
        return self._update(request, medicine_id, partial=False)

    def patch(self, request, medicine_id):
        return self._update(request, medicine_id, partial=True)

    def _update(self, request, medicine_id, partial=False):
        med = medicine_storage.get_by_id(medicine_id)
        if not med:
            return Response(
                {"success": False, "error": f"Medicine '{medicine_id}' not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = MedicineSerializer(data=request.data, partial=partial)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "error": "Validation failed",
                    "details": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            updated = medicine_storage.update(medicine_id, serializer.validated_data)
            return Response(
                {
                    "success": True,
                    "message": f"Medicine '{medicine_id}' updated successfully.",
                    "medicine": updated,
                },
                status=status.HTTP_200_OK,
            )
        except MedicineStorageError as exc:
            return Response(
                {"success": False, "error": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def delete(self, request, medicine_id):
        med = medicine_storage.get_by_id(medicine_id)
        if not med:
            return Response(
                {"success": False, "error": f"Medicine '{medicine_id}' not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        force = request.query_params.get("force", "false").lower() in ("true", "1")
        result = medicine_storage.delete_or_deactivate(medicine_id, force_delete=force)
        return Response(
            {
                "success": True,
                "message": (
                    f"Medicine '{medicine_id}' deactivated to preserve prescription history."
                    if result.get("action") == "deactivated"
                    else f"Medicine '{medicine_id}' deleted successfully."
                ),
                **result,
            },
            status=status.HTTP_200_OK,
        )


# ============================================================================
# Report Template Views
# ============================================================================

from .report_template_storage import report_template_storage, ReportTemplateStorageError
from .serializers import ReportTemplateSerializer


class ReportTemplateListCreateView(APIView):
    """
    GET  /api/report-templates/ - List report templates with search and filtering
    POST /api/report-templates/ - Create a new report template
    """

    def get(self, request):
        try:
            search = request.query_params.get("search", None)
            group = request.query_params.get("group", None)
            department = request.query_params.get("department", None)
            active_param = request.query_params.get("active_only", "false").lower()
            active_only = active_param in ("true", "1", "yes")

            templates = report_template_storage.get_all(
                active_only=active_only,
                query=search,
                group=group,
                department=department
            )
            return Response(
                {
                    "success": True,
                    "count": len(templates),
                    "templates": templates,
                },
                status=status.HTTP_200_OK,
            )
        except ReportTemplateStorageError as exc:
            return Response(
                {"success": False, "error": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request):
        serializer = ReportTemplateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "error": "Validation failed",
                    "details": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            created = report_template_storage.create(serializer.validated_data)
            return Response(
                {
                    "success": True,
                    "message": f"Template '{created.get('templateName')}' created successfully.",
                    "template": created,
                },
                status=status.HTTP_201_CREATED,
            )
        except ReportTemplateStorageError as exc:
            return Response(
                {"success": False, "error": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class ReportTemplateDetailView(APIView):
    """
    GET    /api/report-templates/<template_id>/ - Retrieve single template
    PUT    /api/report-templates/<template_id>/ - Full update
    PATCH  /api/report-templates/<template_id>/ - Partial update
    DELETE /api/report-templates/<template_id>/ - Deactivate or delete template
    """

    def get(self, request, template_id):
        tpl = report_template_storage.get_by_id(template_id)
        if not tpl:
            return Response(
                {"success": False, "error": f"Template '{template_id}' not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response({"success": True, "template": tpl}, status=status.HTTP_200_OK)

    def put(self, request, template_id):
        return self._update(request, template_id, partial=False)

    def patch(self, request, template_id):
        return self._update(request, template_id, partial=True)

    def _update(self, request, template_id, partial=False):
        tpl = report_template_storage.get_by_id(template_id)
        if not tpl:
            return Response(
                {"success": False, "error": f"Template '{template_id}' not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = ReportTemplateSerializer(data=request.data, partial=partial)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "error": "Validation failed",
                    "details": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            updated = report_template_storage.update(template_id, serializer.validated_data)
            return Response(
                {
                    "success": True,
                    "message": f"Template '{template_id}' updated successfully.",
                    "template": updated,
                },
                status=status.HTTP_200_OK,
            )
        except ReportTemplateStorageError as exc:
            return Response(
                {"success": False, "error": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def delete(self, request, template_id):
        tpl = report_template_storage.get_by_id(template_id)
        if not tpl:
            return Response(
                {"success": False, "error": f"Template '{template_id}' not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        force = request.query_params.get("force", "false").lower() in ("true", "1")
        result = report_template_storage.delete_or_deactivate(template_id, force_delete=force)
        return Response(
            {
                "success": True,
                "message": (
                    f"Template '{template_id}' deactivated to preserve historical report records."
                    if result.get("action") == "deactivated"
                    else f"Template '{template_id}' deleted successfully."
                ),
                **result,
            },
            status=status.HTTP_200_OK,
        )


# ============================================================================
# Echo (Echocardiography) Report Views
# ============================================================================

from .echo_report_storage import EchoReportJSONStorage, EchoReportStorageError
from .serializers import EchoReportSerializer

echo_report_storage = EchoReportJSONStorage()


class EchoReportListCreateView(APIView):
    """
    GET  /api/echo-reports/ - List Echo Reports with search, patient, doctor, and date filtering
    POST /api/echo-reports/ - Create a new Echo Report linked to an existing patient
    """

    def get(self, request):
        try:
            query = request.query_params.get("search") or request.query_params.get("q")
            uhid = request.query_params.get("uhid")
            status_filter = request.query_params.get("status")
            from_date = request.query_params.get("from_date")
            to_date = request.query_params.get("to_date")
            doctor = request.query_params.get("doctor")

            reports = echo_report_storage.get_all(
                query=query,
                uhid=uhid,
                status=status_filter,
                from_date=from_date,
                to_date=to_date,
                doctor=doctor
            )
            return Response(
                {
                    "success": True,
                    "count": len(reports),
                    "reports": reports,
                },
                status=status.HTTP_200_OK,
            )
        except EchoReportStorageError as exc:
            return Response(
                {"success": False, "error": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request):
        serializer = EchoReportSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "error": "Validation failed",
                    "details": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            created = echo_report_storage.create(serializer.validated_data)
            return Response(
                {
                    "success": True,
                    "message": f"Echo report '{created['id']}' created successfully.",
                    "report": created,
                },
                status=status.HTTP_201_CREATED,
            )
        except EchoReportStorageError as exc:
            return Response(
                {"success": False, "error": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class EchoReportDetailView(APIView):
    """
    GET    /api/echo-reports/<id>/ - Retrieve Echo Report details
    PUT    /api/echo-reports/<id>/ - Update Echo Report (protected if Finalized)
    DELETE /api/echo-reports/<id>/ - Delete Echo Report
    """

    def get(self, request, report_id):
        rep = echo_report_storage.get_by_id(report_id)
        if not rep:
            return Response(
                {"success": False, "error": f"Echo report '{report_id}' not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(
            {"success": True, "report": rep},
            status=status.HTTP_200_OK,
        )

    def put(self, request, report_id):
        rep = echo_report_storage.get_by_id(report_id)
        if not rep:
            return Response(
                {"success": False, "error": f"Echo report '{report_id}' not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = EchoReportSerializer(data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "error": "Validation failed",
                    "details": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        allow_finalized_edit = serializer.validated_data.pop("allow_finalized_edit", False)

        try:
            updated = echo_report_storage.update(
                report_id,
                serializer.validated_data,
                allow_finalized_edit=allow_finalized_edit
            )
            return Response(
                {
                    "success": True,
                    "message": f"Echo report '{report_id}' updated successfully.",
                    "report": updated,
                },
                status=status.HTTP_200_OK,
            )
        except EchoReportStorageError as exc:
            return Response(
                {"success": False, "error": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def delete(self, request, report_id):
        rep = echo_report_storage.get_by_id(report_id)
        if not rep:
            return Response(
                {"success": False, "error": f"Echo report '{report_id}' not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            echo_report_storage.delete(report_id)
            return Response(
                {
                    "success": True,
                    "message": f"Echo report '{report_id}' deleted successfully.",
                },
                status=status.HTTP_200_OK,
            )
        except EchoReportStorageError as exc:
            return Response(
                {"success": False, "error": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class EchoReportFinalizeView(APIView):
    """
    POST /api/echo-reports/<id>/finalize/ - Finalize and lock Echo Report findings
    """

    def post(self, request, report_id):
        rep = echo_report_storage.get_by_id(report_id)
        if not rep:
            return Response(
                {"success": False, "error": f"Echo report '{report_id}' not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        finalized_by = request.data.get("finalizedBy")
        try:
            finalized = echo_report_storage.finalize(report_id, finalized_by=finalized_by)
            return Response(
                {
                    "success": True,
                    "message": f"Echo report '{report_id}' has been finalized and locked.",
                    "report": finalized,
                },
                status=status.HTTP_200_OK,
            )
        except EchoReportStorageError as exc:
            return Response(
                {"success": False, "error": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

