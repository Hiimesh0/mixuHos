import re
from rest_framework import serializers


class PatientSerializer(serializers.Serializer):
    """
    Serializer for Patient Registration module.
    Performs comprehensive validation for JSON-backed storage without DB models.
    """
    id = serializers.CharField(read_only=True)
    uhid = serializers.CharField(required=False, allow_blank=True)
    category = serializers.CharField(default="NEW", max_length=50)
    firstName = serializers.CharField(required=True, max_length=100)
    middleName = serializers.CharField(required=False, allow_blank=True, max_length=100, default="")
    lastName = serializers.CharField(required=False, allow_blank=True, max_length=100, default="")
    birthDate = serializers.CharField(required=False, allow_blank=True, default="")
    age = serializers.CharField(required=True, max_length=10)
    ageUnit = serializers.CharField(default="Years", max_length=20)
    ageMonths = serializers.CharField(required=False, allow_blank=True, max_length=10, default="")
    ageDays = serializers.CharField(required=False, allow_blank=True, max_length=10, default="")
    sex = serializers.ChoiceField(choices=["Male", "Female", "Other", "Transgender"], default="Male")
    hospitalDoctor = serializers.CharField(required=True, max_length=150)
    referenceBy = serializers.CharField(required=False, allow_blank=True, max_length=150, default="")
    religion = serializers.CharField(required=False, allow_blank=True, max_length=50, default="Hindu")
    maritalStatus = serializers.CharField(required=False, allow_blank=True, max_length=50, default="")
    weight = serializers.CharField(required=False, allow_blank=True, max_length=20, default="")
    height = serializers.CharField(required=False, allow_blank=True, max_length=20, default="")
    mobile = serializers.CharField(required=True, max_length=20)
    email = serializers.EmailField(required=False, allow_blank=True, default="")
    streetAddress = serializers.CharField(required=False, allow_blank=True, max_length=255, default="")
    city = serializers.CharField(required=False, allow_blank=True, max_length=100, default="SURAT")
    state = serializers.CharField(required=False, allow_blank=True, max_length=100, default="GUJARAT")
    pinCode = serializers.CharField(required=False, allow_blank=True, max_length=20, default="")
    autoSms = serializers.BooleanField(default=True)
    estimate = serializers.CharField(required=False, allow_blank=True, max_length=50, default="")
    aadharNo = serializers.CharField(required=False, allow_blank=True, max_length=30, default="")
    panNo = serializers.CharField(required=False, allow_blank=True, max_length=30, default="")
    mediclaim = serializers.CharField(required=False, allow_blank=True, max_length=100, default="")
    membershipId = serializers.CharField(required=False, allow_blank=True, max_length=50, default="")
    employeeId = serializers.CharField(required=False, allow_blank=True, max_length=50, default="")
    companyName = serializers.CharField(required=False, allow_blank=True, max_length=150, default="")
    remark = serializers.CharField(required=False, allow_blank=True, max_length=500, default="")
    createdAt = serializers.CharField(read_only=True)
    updatedAt = serializers.CharField(read_only=True)

    def validate_firstName(self, value):
        val = value.strip()
        if not val:
            raise serializers.ValidationError("First Name is required and cannot be empty.")
        if len(val) < 2:
            raise serializers.ValidationError("First Name must be at least 2 characters.")
        return val

    def validate_mobile(self, value):
        val = value.strip()
        if not val:
            raise serializers.ValidationError("Mobile Number is required.")
        # Allow 10 to 15 digits, optionally prefixed with '+'
        clean_num = val.lstrip('+').replace('-', '').replace(' ', '')
        if not clean_num.isdigit() or len(clean_num) < 10 or len(clean_num) > 15:
            raise serializers.ValidationError("Please provide a valid 10-15 digit mobile number.")
        return val

    def validate_age(self, value):
        val = str(value).strip()
        if not val:
            raise serializers.ValidationError("Age is required.")
        try:
            num = int(val)
            if num < 0 or num > 130:
                raise serializers.ValidationError("Age must be between 0 and 130.")
        except ValueError:
            raise serializers.ValidationError("Age must be a valid number.")
        return val

    def validate_hospitalDoctor(self, value):
        val = value.strip()
        if not val:
            raise serializers.ValidationError("Hospital Doctor is required.")
        return val



class DoctorSerializer(serializers.Serializer):
    """
    Serializer for Doctor Master module.
    Comprehensive validation for doctor credentials, contact info, fees, and clinic details.
    """
    id = serializers.CharField(required=False, allow_blank=True)
    drHosRef = serializers.ChoiceField(
        choices=["Hospital Doctor", "Reference Doctor", "Both"],
        default="Hospital Doctor"
    )
    drType = serializers.CharField(required=False, allow_blank=True, default="Consultant", max_length=100)
    title = serializers.ChoiceField(choices=["Dr.", "Mr.", "Mrs.", "Ms."], default="Dr.")
    drName = serializers.CharField(required=True, max_length=150)
    degree = serializers.CharField(required=False, allow_blank=True, default="", max_length=150)
    speciality = serializers.CharField(required=False, allow_blank=True, default="", max_length=150)
    department = serializers.CharField(required=False, allow_blank=True, default="", max_length=150)
    drRegNo = serializers.CharField(required=False, allow_blank=True, default="", max_length=50)
    hospitalName = serializers.BooleanField(default=True)
    birthDate = serializers.CharField(required=False, allow_blank=True, default="")
    wedding = serializers.CharField(required=False, allow_blank=True, default="", max_length=50)
    panNo = serializers.CharField(required=False, allow_blank=True, default="", max_length=30)
    adharNo = serializers.CharField(required=False, allow_blank=True, default="", max_length=30)
    mobileNo = serializers.CharField(required=True, max_length=20)
    phNoR = serializers.CharField(required=False, allow_blank=True, default="", max_length=30)
    email = serializers.EmailField(required=False, allow_blank=True, default="")
    consultationFee = serializers.FloatField(required=False, default=0.0, min_value=0.0)
    followupFee = serializers.FloatField(required=False, default=0.0, min_value=0.0)
    clinicName = serializers.CharField(required=False, allow_blank=True, default="", max_length=200)
    address = serializers.CharField(required=False, allow_blank=True, default="", max_length=255)
    area = serializers.CharField(required=False, allow_blank=True, default="", max_length=100)
    city = serializers.CharField(required=False, allow_blank=True, default="SURAT", max_length=100)
    pin = serializers.CharField(required=False, allow_blank=True, default="", max_length=20)
    state = serializers.CharField(required=False, allow_blank=True, default="GUJARAT", max_length=100)
    country = serializers.CharField(required=False, allow_blank=True, default="INDIA", max_length=100)
    clinicPhNo = serializers.CharField(required=False, allow_blank=True, default="", max_length=30)
    status = serializers.ChoiceField(choices=["active", "inactive"], default="active")

    def validate_drName(self, value):
        val = value.strip()
        if not val:
            raise serializers.ValidationError("Doctor Name is required.")
        if len(val) < 2:
            raise serializers.ValidationError("Doctor Name must be at least 2 characters.")
        return val

    def validate_mobileNo(self, value):
        val = value.strip()
        if not val:
            raise serializers.ValidationError("Mobile Number is required.")
        clean_num = val.lstrip('+').replace('-', '').replace(' ', '')
        if not clean_num.isdigit() or len(clean_num) < 10 or len(clean_num) > 15:
            raise serializers.ValidationError("Please provide a valid 10-15 digit mobile number.")
        return val


class MedicineSerializer(serializers.Serializer):
    """
    Serializer for Medicine Master module.
    Validates drug names, dosages, prices, stock quantities, and clinical instructions.
    """
    id = serializers.CharField(required=False, allow_blank=True)
    brandName = serializers.CharField(required=True, max_length=200)
    genericName = serializers.CharField(required=True, max_length=200)
    medicineGroup = serializers.CharField(required=False, allow_blank=True, default="", max_length=150)
    dosageForm = serializers.CharField(required=False, allow_blank=True, default="Tablet", max_length=100)
    strength = serializers.CharField(required=False, allow_blank=True, default="", max_length=100)
    frequency = serializers.CharField(required=False, allow_blank=True, default="", max_length=100)
    availability = serializers.CharField(required=False, allow_blank=True, default="In Stock", max_length=100)
    remark1 = serializers.CharField(required=False, allow_blank=True, default="", max_length=255)
    remark2 = serializers.CharField(required=False, allow_blank=True, default="", max_length=255)
    totalDays = serializers.IntegerField(required=False, default=0, min_value=0)
    notes = serializers.CharField(required=False, allow_blank=True, default="", max_length=500)
    forPatient = serializers.ChoiceField(choices=["Both", "OPD", "IPD", "Male", "Female"], default="Both")
    unit = serializers.CharField(required=False, allow_blank=True, default="Strip", max_length=100)
    manufacturer = serializers.CharField(required=False, allow_blank=True, default="", max_length=200)
    batchNo = serializers.CharField(required=False, allow_blank=True, default="", max_length=100)
    expiryDate = serializers.CharField(required=False, allow_blank=True, default="")
    purchasePrice = serializers.FloatField(required=False, default=0.0, min_value=0.0)
    sellingPrice = serializers.FloatField(required=False, default=0.0, min_value=0.0)
    stockQty = serializers.IntegerField(required=False, default=0, min_value=0)
    reorderLevel = serializers.IntegerField(required=False, default=0, min_value=0)
    gst = serializers.FloatField(required=False, default=0.0, min_value=0.0, max_value=100.0)
    status = serializers.ChoiceField(choices=["active", "inactive"], default="active")

    def validate_brandName(self, value):
        val = value.strip()
        if not val:
            raise serializers.ValidationError("Brand Name is required.")
        if len(val) < 2:
            raise serializers.ValidationError("Brand Name must be at least 2 characters.")
        return val

    def validate_genericName(self, value):
        val = value.strip()
        if not val:
            raise serializers.ValidationError("Generic Name is required.")
        return val


class ReportTemplateSerializer(serializers.Serializer):
    """
    Serializer for Report Template module.
    Validates report template groups, headers, and structured findings content.
    """
    id = serializers.CharField(required=False, allow_blank=True)
    groupName = serializers.CharField(required=True, max_length=100)
    templateName = serializers.CharField(required=True, max_length=200)
    reportHeader = serializers.CharField(required=False, allow_blank=True, default="", max_length=255)
    department = serializers.CharField(required=False, allow_blank=True, default="", max_length=150)
    details = serializers.CharField(required=True, allow_blank=False)
    status = serializers.ChoiceField(choices=["active", "inactive"], default="active")

    def validate_groupName(self, value):
        val = value.strip()
        if not val:
            raise serializers.ValidationError("Group Name is required.")
        return val

    def validate_templateName(self, value):
        val = value.strip()
        if not val:
            raise serializers.ValidationError("Template Name is required.")
        if len(val) < 2:
            raise serializers.ValidationError("Template Name must be at least 2 characters.")
        return val

    def validate_details(self, value):
        val = value.strip()
        if not val:
            raise serializers.ValidationError("Template Details/Content cannot be empty.")
        return val


class EchoReportSerializer(serializers.Serializer):
    """
    Serializer for Echo (Echocardiography) Report module.
    Validates patient linkage, clinical measurements, and reporting doctors.
    """
    id = serializers.CharField(read_only=True)
    uhid = serializers.CharField(required=True, max_length=50)
    patientName = serializers.CharField(required=False, allow_blank=True, max_length=150, default="")
    age = serializers.CharField(required=False, allow_blank=True, max_length=20, default="")
    sex = serializers.CharField(required=False, allow_blank=True, max_length=20, default="")
    reportDate = serializers.CharField(required=False, allow_blank=True, max_length=30, default="")
    referredBy = serializers.CharField(required=False, allow_blank=True, max_length=150, default="")
    c_o = serializers.CharField(required=False, allow_blank=True, max_length=300, default="")

    # Measurements & anatomical observations
    mitralValve = serializers.CharField(required=False, allow_blank=True, max_length=150, default="")
    tricuspidValve = serializers.CharField(required=False, allow_blank=True, max_length=150, default="")
    aorta = serializers.CharField(required=False, allow_blank=True, max_length=100, default="")
    leftVentricle = serializers.CharField(required=False, allow_blank=True, max_length=150, default="")
    rwma = serializers.CharField(required=False, allow_blank=True, max_length=150, default="")
    rightVentricle = serializers.CharField(required=False, allow_blank=True, max_length=150, default="")
    ivc = serializers.CharField(required=False, allow_blank=True, max_length=100, default="")
    aorticValve = serializers.CharField(required=False, allow_blank=True, max_length=150, default="")
    pulmonaryValve = serializers.CharField(required=False, allow_blank=True, max_length=150, default="")
    lvef = serializers.CharField(required=False, allow_blank=True, max_length=50, default="")
    leftAtrium = serializers.CharField(required=False, allow_blank=True, max_length=100, default="")
    rightAtrium = serializers.CharField(required=False, allow_blank=True, max_length=100, default="")
    rvsp = serializers.CharField(required=False, allow_blank=True, max_length=50, default="")
    ivs = serializers.CharField(required=False, allow_blank=True, max_length=100, default="")
    septum = serializers.CharField(required=False, allow_blank=True, max_length=50, default="")
    lvidd = serializers.CharField(required=False, allow_blank=True, max_length=50, default="")
    ias = serializers.CharField(required=False, allow_blank=True, max_length=100, default="")
    pWall = serializers.CharField(required=False, allow_blank=True, max_length=50, default="")
    lvids = serializers.CharField(required=False, allow_blank=True, max_length=50, default="")

    # Lower section
    pericardium = serializers.CharField(required=False, allow_blank=True, max_length=150, default="")
    dopplerStudy = serializers.CharField(required=False, allow_blank=True, default="")
    conclusion = serializers.CharField(required=False, allow_blank=True, default="")
    lvCompliance = serializers.CharField(required=False, allow_blank=True, max_length=100, default="")
    tvi = serializers.CharField(required=False, allow_blank=True, max_length=100, default="")
    leftAorticArchPdaCoarctation = serializers.CharField(required=False, allow_blank=True, max_length=150, default="")
    consultantDr = serializers.CharField(required=False, allow_blank=True, max_length=150, default="")

    status = serializers.ChoiceField(choices=["Draft", "Finalized"], default="Draft")
    finalizedAt = serializers.CharField(read_only=True)
    finalizedBy = serializers.CharField(read_only=True)
    createdAt = serializers.CharField(read_only=True)
    updatedAt = serializers.CharField(read_only=True)
    allow_finalized_edit = serializers.BooleanField(required=False, default=False, write_only=True)

    def validate_uhid(self, value):
        val = value.strip().upper()
        if not val:
            raise serializers.ValidationError("Patient UHID / Pt.Code is required.")
        return val
