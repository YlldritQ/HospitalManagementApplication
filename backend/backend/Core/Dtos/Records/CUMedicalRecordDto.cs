using backend.Core.Dtos.Patient;

namespace backend.Core.Dtos.Records
{
    public class CUMedicalRecordDto
    {
        public int PatientId { get; set; }
        public DateTime RecordDate { get; set; }
        public string RecordDetails { get; set; }
        public PatientDto? Patient { get; set; }
    }
}
