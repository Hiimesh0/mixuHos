"""
REST API Views for Hospital EMR Domain Entities.
Exposes fully typed CRUD and workflow endpoints backed by BaseJSONRepository.
Supports sorting, filtering, searching, foreign key validation, and atomic JSON transactions.
"""

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .repositories import (
    department_repo,
    room_type_repo,
    bed_repo,
    operation_group_repo,
    insurance_repo,
    visiting_type_repo,
    short_form_repo,
    advice_repo,
    contact_repo,
    prescription_template_repo,
    patient_visit_repo,
    admission_repo,
    discharge_repo,
    deposit_repo,
    dr_visit_procedure_repo,
    ot_repo,
    investigation_repo,
    certificate_repo,
    opd_charge_repo,
    opd_profile_repo,
    visit_header_repo,
    RepositoryError,
    RecordNotFoundError,
    ValidationError,
)


class GenericRepositoryListCreateView(APIView):
    """Reusable generic view for listing and creating domain records."""
    repo = None
    entity_plural = "items"

    def get(self, request):
        try:
            search = request.query_params.get("search", None)
            active_only = request.query_params.get("active", "false").lower() in ("true", "1")
            
            # Extract query params as filters
            filters = {}
            for k, v in request.query_params.items():
                if k not in ("search", "active", "format"):
                    filters[k] = v

            if search:
                items = self.repo.search(search)
                if filters:
                    items = [it for it in items if all(str(it.get(fk) or "").lower() == str(fv).lower() for fk, fv in filters.items())]
            elif filters:
                items = self.repo.filter(**filters)
            else:
                items = self.repo.get_all(active_only=active_only)

            return Response({
                "success": True,
                "count": len(items),
                self.entity_plural: items,
            }, status=status.HTTP_200_OK)
        except RepositoryError as exc:
            return Response({"success": False, "error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        if not isinstance(request.data, dict):
            return Response({"success": False, "error": "Invalid request body; JSON object expected."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            created = self.repo.create(request.data)
            return Response({
                "success": True,
                "message": f"{self.repo.entity_name} created successfully.",
                "item": created,
            }, status=status.HTTP_201_CREATED)
        except ValidationError as exc:
            return Response({"success": False, "error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        except RepositoryError as exc:
            return Response({"success": False, "error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GenericRepositoryDetailView(APIView):
    """Reusable generic view for viewing, updating, and deleting domain records."""
    repo = None

    def get(self, request, pk):
        item = self.repo.get_by_id(pk)
        if not item:
            return Response({"success": False, "error": f"{self.repo.entity_name} '{pk}' not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response({"success": True, "item": item}, status=status.HTTP_200_OK)

    def put(self, request, pk):
        try:
            updated = self.repo.update(pk, request.data)
            return Response({
                "success": True,
                "message": f"{self.repo.entity_name} updated successfully.",
                "item": updated,
            }, status=status.HTTP_200_OK)
        except RecordNotFoundError as exc:
            return Response({"success": False, "error": str(exc)}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as exc:
            return Response({"success": False, "error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        except RepositoryError as exc:
            return Response({"success": False, "error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, pk):
        return self.put(request, pk)

    def delete(self, request, pk):
        hard = request.query_params.get("hard", "false").lower() in ("true", "1")
        try:
            self.repo.delete(pk, hard=hard)
            return Response({
                "success": True,
                "message": f"{self.repo.entity_name} '{pk}' deleted successfully.",
            }, status=status.HTTP_200_OK)
        except RecordNotFoundError as exc:
            return Response({"success": False, "error": str(exc)}, status=status.HTTP_404_NOT_FOUND)
        except RepositoryError as exc:
            return Response({"success": False, "error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Concrete Master Views
class DepartmentListCreateView(GenericRepositoryListCreateView):
    repo = department_repo
    entity_plural = "departments"

class DepartmentDetailView(GenericRepositoryDetailView):
    repo = department_repo

class RoomTypeListCreateView(GenericRepositoryListCreateView):
    repo = room_type_repo
    entity_plural = "room_types"

class RoomTypeDetailView(GenericRepositoryDetailView):
    repo = room_type_repo

class BedListCreateView(GenericRepositoryListCreateView):
    repo = bed_repo
    entity_plural = "beds"

class BedDetailView(GenericRepositoryDetailView):
    repo = bed_repo

class BedAllocateView(APIView):
    def post(self, request, bed_number):
        admission_id = request.data.get("admission_id", "")
        patient_id = request.data.get("patient_id", "")
        allocated = bed_repo.allocate_bed(bed_number, admission_id, patient_id)
        if not allocated:
            return Response({"success": False, "error": f"Bed '{bed_number}' not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response({"success": True, "message": f"Bed {bed_number} allocated.", "bed": allocated}, status=status.HTTP_200_OK)

class BedReleaseView(APIView):
    def post(self, request, bed_number):
        released = bed_repo.release_bed(bed_number)
        if not released:
            return Response({"success": False, "error": f"Bed '{bed_number}' not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response({"success": True, "message": f"Bed {bed_number} released.", "bed": released}, status=status.HTTP_200_OK)

class OperationGroupListCreateView(GenericRepositoryListCreateView):
    repo = operation_group_repo
    entity_plural = "operation_groups"

class OperationGroupDetailView(GenericRepositoryDetailView):
    repo = operation_group_repo

class InsuranceCompanyListCreateView(GenericRepositoryListCreateView):
    repo = insurance_repo
    entity_plural = "insurance_companies"

class InsuranceCompanyDetailView(GenericRepositoryDetailView):
    repo = insurance_repo

class VisitingTypeListCreateView(GenericRepositoryListCreateView):
    repo = visiting_type_repo
    entity_plural = "visiting_types"

class VisitingTypeDetailView(GenericRepositoryDetailView):
    repo = visiting_type_repo

class ShortFormListCreateView(GenericRepositoryListCreateView):
    repo = short_form_repo
    entity_plural = "short_forms"

class ShortFormDetailView(GenericRepositoryDetailView):
    repo = short_form_repo

class AdviceListCreateView(GenericRepositoryListCreateView):
    repo = advice_repo
    entity_plural = "advices"

class AdviceDetailView(GenericRepositoryDetailView):
    repo = advice_repo

class ContactListCreateView(GenericRepositoryListCreateView):
    repo = contact_repo
    entity_plural = "contacts"

class ContactDetailView(GenericRepositoryDetailView):
    repo = contact_repo

class PrescriptionTemplateListCreateView(GenericRepositoryListCreateView):
    repo = prescription_template_repo
    entity_plural = "templates"

class PrescriptionTemplateDetailView(GenericRepositoryDetailView):
    repo = prescription_template_repo


# Inpatient / Hospital Views
class AdmissionListCreateView(GenericRepositoryListCreateView):
    repo = admission_repo
    entity_plural = "admissions"

    def post(self, request):
        try:
            admission = admission_repo.admit_patient(request.data)
            return Response({
                "success": True,
                "message": f"Patient admitted successfully with IPD #{admission.get('ipd_no')}.",
                "admission": admission,
            }, status=status.HTTP_201_CREATED)
        except ValidationError as exc:
            return Response({"success": False, "error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        except RepositoryError as exc:
            return Response({"success": False, "error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AdmissionDetailView(GenericRepositoryDetailView):
    repo = admission_repo

class DischargeListCreateView(GenericRepositoryListCreateView):
    repo = discharge_repo
    entity_plural = "discharges"

    def post(self, request):
        try:
            discharge = discharge_repo.process_discharge(request.data)
            return Response({
                "success": True,
                "message": f"Discharge card #{discharge.get('discharge_no')} processed and bed vacated.",
                "discharge": discharge,
            }, status=status.HTTP_201_CREATED)
        except ValidationError as exc:
            return Response({"success": False, "error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        except RepositoryError as exc:
            return Response({"success": False, "error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DischargeDetailView(GenericRepositoryDetailView):
    repo = discharge_repo

class DepositListCreateView(GenericRepositoryListCreateView):
    repo = deposit_repo
    entity_plural = "deposits"

class DepositDetailView(GenericRepositoryDetailView):
    repo = deposit_repo

class DrVisitProcedureListCreateView(GenericRepositoryListCreateView):
    repo = dr_visit_procedure_repo
    entity_plural = "entries"

class DrVisitProcedureDetailView(GenericRepositoryDetailView):
    repo = dr_visit_procedure_repo

class OtEntryListCreateView(GenericRepositoryListCreateView):
    repo = ot_repo
    entity_plural = "entries"

class OtEntryDetailView(GenericRepositoryDetailView):
    repo = ot_repo

class InvestigationListCreateView(GenericRepositoryListCreateView):
    repo = investigation_repo
    entity_plural = "investigations"

class InvestigationDetailView(GenericRepositoryDetailView):
    repo = investigation_repo

class CertificateListCreateView(GenericRepositoryListCreateView):
    repo = certificate_repo
    entity_plural = "certificates"

class CertificateDetailView(GenericRepositoryDetailView):
    repo = certificate_repo


class OPDChargeListCreateView(GenericRepositoryListCreateView):
    repo = opd_charge_repo
    entity_plural = "charges"


class OPDChargeDetailView(GenericRepositoryDetailView):
    repo = opd_charge_repo


class OPDProfileListCreateView(GenericRepositoryListCreateView):
    repo = opd_profile_repo
    entity_plural = "profiles"


class OPDProfileDetailView(GenericRepositoryDetailView):
    repo = opd_profile_repo


class VisitProcedureHeaderListCreateView(GenericRepositoryListCreateView):
    repo = visit_header_repo
    entity_plural = "headers"


class VisitProcedureHeaderDetailView(GenericRepositoryDetailView):
    repo = visit_header_repo


# Patient Longitudinal Visits View
class PatientVisitsView(APIView):
    """
    GET /api/patients/<uhid>/visits/ - Get all visits for patient
    POST /api/patients/<uhid>/visits/ - Create a new visit for returning patient
    """

    def get(self, request, patient_id):
        visits = patient_visit_repo.get_visits_for_patient(patient_id)
        return Response({
            "success": True,
            "patient_id": patient_id,
            "count": len(visits),
            "visits": visits,
        }, status=status.HTTP_200_OK)

    def post(self, request, patient_id):
        doctor = request.data.get("doctor", "Dr. Nilesh Mahale")
        patient_name = request.data.get("patient_name", "")
        visit_type = request.data.get("visit_type", "Follow-up")
        complaint = request.data.get("chief_complaint", "")
        vitals = request.data.get("vitals", {})

        try:
            visit = patient_visit_repo.create_next_visit(
                uhid=patient_id,
                patient_name=patient_name,
                doctor=doctor,
                visit_type=visit_type,
                complaint=complaint,
                vitals=vitals,
            )
            return Response({
                "success": True,
                "message": f"Visit #{visit.get('visit_no')} recorded for patient {patient_id}.",
                "visit": visit,
            }, status=status.HTTP_201_CREATED)
        except RepositoryError as exc:
            return Response({"success": False, "error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

