using System;

namespace backend.Core.Entities
{
    public class Room
    {
        public int Id { get; set; }
        public string RoomNumber { get; set; } = null!;
        public bool IsOccupied { get; set; } // Nullable if room is not currently occupied
        public int? DepartmentId { get; set; }
        public virtual Department Department { get; set; }

        // Navigation property
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public ICollection<DoctorRoom> DoctorRooms { get; set; } = new List<DoctorRoom>();
        public ICollection<NurseRoom> NurseRooms { get; set; } = new List<NurseRoom>();

    }
}
