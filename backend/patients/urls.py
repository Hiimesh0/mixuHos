from django.urls import path
from .views import (
    PatientListCreateView,
    PatientDetailView,
    PatientStickerPdfView,
    PatientBillView,
    PatientBillPdfView,
    BillsListView,
    HospitalConfigView,
    ChargeMasterView,
    DoctorListCreateView,
    DoctorDetailView,
    MedicineListCreateView,
    MedicineDetailView,
    ReportTemplateListCreateView,
    ReportTemplateDetailView,
    EchoReportListCreateView,
    EchoReportDetailView,
    EchoReportFinalizeView,
)
from .accounts_views import (
    AccountsSummaryView,
    AccountsTransactionsView,
    AccountsExportView,
)
from .domain_views import (
    DepartmentListCreateView,
    DepartmentDetailView,
    RoomTypeListCreateView,
    RoomTypeDetailView,
    BedListCreateView,
    BedDetailView,
    BedAllocateView,
    BedReleaseView,
    OperationGroupListCreateView,
    OperationGroupDetailView,
    InsuranceCompanyListCreateView,
    InsuranceCompanyDetailView,
    VisitingTypeListCreateView,
    VisitingTypeDetailView,
    ShortFormListCreateView,
    ShortFormDetailView,
    AdviceListCreateView,
    AdviceDetailView,
    ContactListCreateView,
    ContactDetailView,
    PrescriptionTemplateListCreateView,
    PrescriptionTemplateDetailView,
    AdmissionListCreateView,
    AdmissionDetailView,
    DischargeListCreateView,
    DischargeDetailView,
    DepositListCreateView,
    DepositDetailView,
    DrVisitProcedureListCreateView,
    DrVisitProcedureDetailView,
    OtEntryListCreateView,
    OtEntryDetailView,
    InvestigationListCreateView,
    InvestigationDetailView,
    CertificateListCreateView,
    CertificateDetailView,
    PatientVisitsView,
    OPDChargeListCreateView,
    OPDChargeDetailView,
    OPDProfileListCreateView,
    OPDProfileDetailView,
    VisitProcedureHeaderListCreateView,
    VisitProcedureHeaderDetailView,
)

urlpatterns = [
    # Echo (Echocardiography) Report Endpoints
    path("echo-reports/", EchoReportListCreateView.as_view(), name="echo-report-list-create"),
    path("echo-reports", EchoReportListCreateView.as_view(), name="echo-report-list-create-noslash"),
    path("echo-reports/<str:report_id>/finalize/", EchoReportFinalizeView.as_view(), name="echo-report-finalize"),
    path("echo-reports/<str:report_id>/finalize", EchoReportFinalizeView.as_view(), name="echo-report-finalize-noslash"),
    path("echo-reports/<str:report_id>/", EchoReportDetailView.as_view(), name="echo-report-detail"),
    path("echo-reports/<str:report_id>", EchoReportDetailView.as_view(), name="echo-report-detail-noslash"),

    # Doctor Master Endpoints
    path("doctors/", DoctorListCreateView.as_view(), name="doctor-list-create"),
    path("doctors", DoctorListCreateView.as_view(), name="doctor-list-create-noslash"),
    path("doctors/<str:doctor_id>/", DoctorDetailView.as_view(), name="doctor-detail"),
    path("doctors/<str:doctor_id>", DoctorDetailView.as_view(), name="doctor-detail-noslash"),

    # Medicine Master Endpoints
    path("medicines/", MedicineListCreateView.as_view(), name="medicine-list-create"),
    path("medicines", MedicineListCreateView.as_view(), name="medicine-list-create-noslash"),
    path("medicines/<str:medicine_id>/", MedicineDetailView.as_view(), name="medicine-detail"),
    path("medicines/<str:medicine_id>", MedicineDetailView.as_view(), name="medicine-detail-noslash"),

    # Report Template Master Endpoints
    path("report-templates/", ReportTemplateListCreateView.as_view(), name="report-template-list-create"),
    path("report-templates", ReportTemplateListCreateView.as_view(), name="report-template-list-create-noslash"),
    path("report-templates/<str:template_id>/", ReportTemplateDetailView.as_view(), name="report-template-detail"),
    path("report-templates/<str:template_id>", ReportTemplateDetailView.as_view(), name="report-template-detail-noslash"),

    # Charge & Hospital Endpoints
    path("charges/", ChargeMasterView.as_view(), name="charge-master-list"),
    path("charges", ChargeMasterView.as_view(), name="charge-master-list-noslash"),
    path("hospital/config/", HospitalConfigView.as_view(), name="hospital-config"),
    path("hospital/config", HospitalConfigView.as_view(), name="hospital-config-noslash"),

    # Master Entities Endpoints
    path("departments/", DepartmentListCreateView.as_view(), name="department-list-create"),
    path("departments", DepartmentListCreateView.as_view(), name="department-list-create-noslash"),
    path("departments/<str:pk>/", DepartmentDetailView.as_view(), name="department-detail"),
    path("departments/<str:pk>", DepartmentDetailView.as_view(), name="department-detail-noslash"),

    path("room-types/", RoomTypeListCreateView.as_view(), name="room-type-list-create"),
    path("room-types", RoomTypeListCreateView.as_view(), name="room-type-list-create-noslash"),
    path("room-types/<str:pk>/", RoomTypeDetailView.as_view(), name="room-type-detail"),
    path("room-types/<str:pk>", RoomTypeDetailView.as_view(), name="room-type-detail-noslash"),

    path("beds/", BedListCreateView.as_view(), name="bed-list-create"),
    path("beds", BedListCreateView.as_view(), name="bed-list-create-noslash"),
    path("beds/<str:pk>/", BedDetailView.as_view(), name="bed-detail"),
    path("beds/<str:pk>", BedDetailView.as_view(), name="bed-detail-noslash"),
    path("beds/<str:bed_number>/allocate/", BedAllocateView.as_view(), name="bed-allocate"),
    path("beds/<str:bed_number>/allocate", BedAllocateView.as_view(), name="bed-allocate-noslash"),
    path("beds/<str:bed_number>/release/", BedReleaseView.as_view(), name="bed-release"),
    path("beds/<str:bed_number>/release", BedReleaseView.as_view(), name="bed-release-noslash"),

    path("operation-groups/", OperationGroupListCreateView.as_view(), name="operation-group-list-create"),
    path("operation-groups", OperationGroupListCreateView.as_view(), name="operation-group-list-create-noslash"),
    path("operation-groups/<str:pk>/", OperationGroupDetailView.as_view(), name="operation-group-detail"),
    path("operation-groups/<str:pk>", OperationGroupDetailView.as_view(), name="operation-group-detail-noslash"),

    path("insurance-companies/", InsuranceCompanyListCreateView.as_view(), name="insurance-company-list-create"),
    path("insurance-companies", InsuranceCompanyListCreateView.as_view(), name="insurance-company-list-create-noslash"),
    path("insurance-companies/<str:pk>/", InsuranceCompanyDetailView.as_view(), name="insurance-company-detail"),
    path("insurance-companies/<str:pk>", InsuranceCompanyDetailView.as_view(), name="insurance-company-detail-noslash"),

    path("visiting-types/", VisitingTypeListCreateView.as_view(), name="visiting-type-list-create"),
    path("visiting-types", VisitingTypeListCreateView.as_view(), name="visiting-type-list-create-noslash"),
    path("visiting-types/<str:pk>/", VisitingTypeDetailView.as_view(), name="visiting-type-detail"),
    path("visiting-types/<str:pk>", VisitingTypeDetailView.as_view(), name="visiting-type-detail-noslash"),

    path("short-forms/", ShortFormListCreateView.as_view(), name="short-form-list-create"),
    path("short-forms", ShortFormListCreateView.as_view(), name="short-form-list-create-noslash"),
    path("short-forms/<str:pk>/", ShortFormDetailView.as_view(), name="short-form-detail"),
    path("short-forms/<str:pk>", ShortFormDetailView.as_view(), name="short-form-detail-noslash"),

    path("advices/", AdviceListCreateView.as_view(), name="advice-list-create"),
    path("advices", AdviceListCreateView.as_view(), name="advice-list-create-noslash"),
    path("advices/<str:pk>/", AdviceDetailView.as_view(), name="advice-detail"),
    path("advices/<str:pk>", AdviceDetailView.as_view(), name="advice-detail-noslash"),

    path("contacts/", ContactListCreateView.as_view(), name="contact-list-create"),
    path("contacts", ContactListCreateView.as_view(), name="contact-list-create-noslash"),
    path("contacts/<str:pk>/", ContactDetailView.as_view(), name="contact-detail"),
    path("contacts/<str:pk>", ContactDetailView.as_view(), name="contact-detail-noslash"),

    path("prescription-templates/", PrescriptionTemplateListCreateView.as_view(), name="prescription-template-list-create"),
    path("prescription-templates", PrescriptionTemplateListCreateView.as_view(), name="prescription-template-list-create-noslash"),
    path("prescription-templates/<str:pk>/", PrescriptionTemplateDetailView.as_view(), name="prescription-template-detail"),
    path("prescription-templates/<str:pk>", PrescriptionTemplateDetailView.as_view(), name="prescription-template-detail-noslash"),

    # Inpatient & Hospital Workflows
    path("admissions/", AdmissionListCreateView.as_view(), name="admission-list-create"),
    path("admissions", AdmissionListCreateView.as_view(), name="admission-list-create-noslash"),
    path("admissions/<str:pk>/", AdmissionDetailView.as_view(), name="admission-detail"),
    path("admissions/<str:pk>", AdmissionDetailView.as_view(), name="admission-detail-noslash"),

    path("discharges/", DischargeListCreateView.as_view(), name="discharge-list-create"),
    path("discharges", DischargeListCreateView.as_view(), name="discharge-list-create-noslash"),
    path("discharges/<str:pk>/", DischargeDetailView.as_view(), name="discharge-detail"),
    path("discharges/<str:pk>", DischargeDetailView.as_view(), name="discharge-detail-noslash"),

    path("deposits/", DepositListCreateView.as_view(), name="deposit-list-create"),
    path("deposits", DepositListCreateView.as_view(), name="deposit-list-create-noslash"),
    path("deposits/<str:pk>/", DepositDetailView.as_view(), name="deposit-detail"),
    path("deposits/<str:pk>", DepositDetailView.as_view(), name="deposit-detail-noslash"),

    path("dr-visits-procedures/", DrVisitProcedureListCreateView.as_view(), name="dr-visit-procedure-list-create"),
    path("dr-visits-procedures", DrVisitProcedureListCreateView.as_view(), name="dr-visit-procedure-list-create-noslash"),
    path("dr-visits-procedures/<str:pk>/", DrVisitProcedureDetailView.as_view(), name="dr-visit-procedure-detail"),
    path("dr-visits-procedures/<str:pk>", DrVisitProcedureDetailView.as_view(), name="dr-visit-procedure-detail-noslash"),

    path("ot-entries/", OtEntryListCreateView.as_view(), name="ot-entry-list-create"),
    path("ot-entries", OtEntryListCreateView.as_view(), name="ot-entry-list-create-noslash"),
    path("ot-entries/<str:pk>/", OtEntryDetailView.as_view(), name="ot-entry-detail"),
    path("ot-entries/<str:pk>", OtEntryDetailView.as_view(), name="ot-entry-detail-noslash"),

    # Clinical & Diagnostics
    path("investigations/", InvestigationListCreateView.as_view(), name="investigation-list-create"),
    path("investigations", InvestigationListCreateView.as_view(), name="investigation-list-create-noslash"),
    path("investigations/<str:pk>/", InvestigationDetailView.as_view(), name="investigation-detail"),
    path("investigations/<str:pk>", InvestigationDetailView.as_view(), name="investigation-detail-noslash"),

    path("certificates/", CertificateListCreateView.as_view(), name="certificate-list-create"),
    path("certificates", CertificateListCreateView.as_view(), name="certificate-list-create-noslash"),
    path("certificates/<str:pk>/", CertificateDetailView.as_view(), name="certificate-detail"),
    path("certificates/<str:pk>", CertificateDetailView.as_view(), name="certificate-detail-noslash"),

    # OPD Charges & Profiles Master Endpoints
    path("opd-charges/", OPDChargeListCreateView.as_view(), name="opd-charge-list-create"),
    path("opd-charges", OPDChargeListCreateView.as_view(), name="opd-charge-list-create-noslash"),
    path("opd-charges/<str:pk>/", OPDChargeDetailView.as_view(), name="opd-charge-detail"),
    path("opd-charges/<str:pk>", OPDChargeDetailView.as_view(), name="opd-charge-detail-noslash"),

    path("opd-profiles/", OPDProfileListCreateView.as_view(), name="opd-profile-list-create"),
    path("opd-profiles", OPDProfileListCreateView.as_view(), name="opd-profile-list-create-noslash"),
    path("opd-profiles/<str:pk>/", OPDProfileDetailView.as_view(), name="opd-profile-detail"),
    path("opd-profiles/<str:pk>", OPDProfileDetailView.as_view(), name="opd-profile-detail-noslash"),

    path("visit-procedure-headers/", VisitProcedureHeaderListCreateView.as_view(), name="visit-procedure-header-list-create"),
    path("visit-procedure-headers", VisitProcedureHeaderListCreateView.as_view(), name="visit-procedure-header-list-create-noslash"),
    path("visit-procedure-headers/<str:pk>/", VisitProcedureHeaderDetailView.as_view(), name="visit-procedure-header-detail"),
    path("visit-procedure-headers/<str:pk>", VisitProcedureHeaderDetailView.as_view(), name="visit-procedure-header-detail-noslash"),

    # Patient Registration, Visits & Billing Endpoints
    path("bills/", BillsListView.as_view(), name="bills-list"),
    path("bills", BillsListView.as_view(), name="bills-list-noslash"),
    path("patients/", PatientListCreateView.as_view(), name="patient-list-create"),
    path("patients/<str:patient_id>/sticker.pdf", PatientStickerPdfView.as_view(), name="patient-sticker-pdf"),
    path("patients/<str:patient_id>/sticker/", PatientStickerPdfView.as_view(), name="patient-sticker-pdf-slash"),
    path("patients/<str:patient_id>/bill.pdf", PatientBillPdfView.as_view(), name="patient-bill-pdf"),
    path("patients/<str:patient_id>/bill/pdf/", PatientBillPdfView.as_view(), name="patient-bill-pdf-slash"),
    path("patients/<str:patient_id>/bill/", PatientBillView.as_view(), name="patient-bill"),
    path("patients/<str:patient_id>/bill", PatientBillView.as_view(), name="patient-bill-noslash"),
    path("patients/<str:patient_id>/visits/", PatientVisitsView.as_view(), name="patient-visits"),
    path("patients/<str:patient_id>/visits", PatientVisitsView.as_view(), name="patient-visits-noslash"),
    path("patients/<str:patient_id>/", PatientDetailView.as_view(), name="patient-detail"),

    # Accounts and Financial Reporting Endpoints
    path("accounts/summary/", AccountsSummaryView.as_view(), name="accounts-summary"),
    path("accounts/summary", AccountsSummaryView.as_view(), name="accounts-summary-noslash"),
    path("accounts/transactions/", AccountsTransactionsView.as_view(), name="accounts-transactions"),
    path("accounts/transactions", AccountsTransactionsView.as_view(), name="accounts-transactions-noslash"),
    path("accounts/export/", AccountsExportView.as_view(), name="accounts-export"),
    path("accounts/export", AccountsExportView.as_view(), name="accounts-export-noslash"),
]
