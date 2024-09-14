namespace backend.Core.Dtos.Doctor
{
    public class DoctorRoomManagementDto
    {
        public int DoctorId { get; set; }
        public List<int> RoomIds { get; set; } = new List<int>();

    }
}
