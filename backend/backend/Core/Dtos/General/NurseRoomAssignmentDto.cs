namespace backend.Core.Dtos.General
{
    public class NurseRoomAssignmentDto
    {
        public int NurseId { get; set; }
        public List<int> RoomIds { get; set; } = new List<int>();
    }
}
