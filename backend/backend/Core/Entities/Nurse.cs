namespace backend.Core.Entities
{
    public class Nurse : MedicalStaff
    {
        public string Qualifications { get; set; } = null!;
        public bool IsAvailable { get; set; }
        public int? DepartmentId { get; set; }
        public virtual Department Department { get; set; }
        public ICollection<NurseRoom> NurseRooms { get; set; } = new List<NurseRoom>();
    }
}
