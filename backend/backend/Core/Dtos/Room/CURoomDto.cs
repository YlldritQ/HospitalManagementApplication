namespace backend.Core.Dtos.Room
{
    public class CURoomDto
    {
        public string RoomNumber { get; set; }
        public bool IsOccupied { get; set; } // Nullable if room is not currently occupied
        public int DepartmentId { get; set; }
    }
}
