using backend.Core.Entities;

namespace backend.Core.Dtos.Patient
{
    public class PatientDto
    {
        public int PatientId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string ContactInfo { get; set; }
        public string UserId { get; set; }
    }
}
