namespace backend.Core.Entities
{
    public class Doctor : MedicalStaff
    {
        public string Specialty { get; set; } = null!;
        public string Qualifications { get; set; } = null!;
        public bool IsAvailable { get; set; }
        public int? DepartmentId { get; set; }
        public virtual Department Department { get; set; }
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
        public ICollection<DoctorRoom> DoctorRooms { get; set; } = new List<DoctorRoom>();

    }
}
