using System;

namespace backend.Core.Dtos.General
{
    public class RoomDto
    {
        public int Id { get; set; }
        public string RoomNumber { get; set; } = null!;
        public string RoomType { get; set; } = null!;
        public bool IsOccupied { get; set; }
        public int? PatientId { get; set; } // Nullable if room is not occupied
    }
}
