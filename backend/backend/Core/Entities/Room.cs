using System;

namespace backend.Core.Entities
{
    public class Room
    {
        public int Id { get; set; }
        public string RoomNumber { get; set; } = null!;
        public string RoomType { get; set; } = null!;
        public bool IsOccupied { get; set; }
        public int? PatientId { get; set; } // Nullable if room is not currently occupied

        // Navigation property
        public Patient? Patient { get; set; }
    }
}
