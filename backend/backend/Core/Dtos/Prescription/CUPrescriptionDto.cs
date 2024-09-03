namespace backend.Core.Dtos.Prescription
{
    public class CUPrescriptionDto
    {
        public int PatientId { get; set; }
        public string PatientName { get; set; }
        public int DoctorId { get; set; }
        public string DoctorName { get; set; }
        public DateTime DateIssued { get; set; }
        public string MedicationName { get; set; }
        public string Dosage { get; set; } = null!;
        public string Instructions { get; set; }
    }
}
