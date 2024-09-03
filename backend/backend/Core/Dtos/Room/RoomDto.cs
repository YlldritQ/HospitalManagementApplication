using backend.Core.Entities;
using System;

namespace backend.Core.Dtos.Room
{
    public class RoomDto
    {
        public int Id { get; set; }
        public string RoomNumber { get; set; }
        public bool IsOccupied { get; set; } // Nullable if room is not currently occupied
        public int DepartmentId { get; set; }
    }
}
