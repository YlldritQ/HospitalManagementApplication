namespace backend.Core.Entities
{
    public abstract class MedicalStaff
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Gender { get; set; } = null!;
        public string ContactInfo { get; set; } = null!;
        public DateTime DateOfBirth { get; set; }
        public DateTime DateHired { get; set; }
    }
}
