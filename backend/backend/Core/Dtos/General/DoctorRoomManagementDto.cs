namespace backend.Core.Dtos.General
{
    public class DoctorRoomManagementDto
    {
        public int DoctorId { get; set; }
        public IEnumerable<int> RoomIds { get; set; } = new List<int>();

    }
}
