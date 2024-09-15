using backend.Core.Dtos.Patient;

namespace backend.Core.Dtos.Records
{
    public class CUMedicalRecordDto
    {
        public int PatientId { get; set; }
        public DateTime RecordDate { get; set; }
        public string RecordDetails { get; set; }

        // Optional foreign keys for doctor, nurse, and prescription
        public int? DoctorId { get; set; }
        public int? NurseId { get; set; }
        public int? PrescriptionId { get; set; }
    }
}
