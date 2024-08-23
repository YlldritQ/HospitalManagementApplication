namespace backend.Core.Entities
{
    public class Nurse : MedicalStaff
    {
        public string Department { get; set; } = null!;
        public string Qualifications { get; set; } = null!;
        public bool IsAvailable { get; set; }
    }
}
