namespace backend.Core.Entities
{
    public class DoctorRoom
    {
        public int DoctorId { get; set; }
        public int RoomId { get; set; }

        // Navigation Properties
        public Doctor Doctor { get; set; } = null!;
        public Room Room { get; set; } = null!;
    }
}
