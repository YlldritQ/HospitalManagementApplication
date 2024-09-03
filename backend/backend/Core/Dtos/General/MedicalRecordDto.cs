using backend.Core.Entities;

namespace backend.Core.Dtos.General
{
    public class MedicalRecordDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public DateTime RecordDate { get; set; }
        public string RecordDetails { get; set; }

        public PatientDto? Patient { get; set; }
    }
}
