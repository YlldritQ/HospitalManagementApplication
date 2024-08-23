namespace backend.Core.Dtos.General
{
    public class DoctorDto
    {
        public int DoctorId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Specialty { get; set; }
        public string Qualifications { get; set; }
        public string ContactInfo { get; set; }
        public bool IsAvailable { get; set; }
    }
}
