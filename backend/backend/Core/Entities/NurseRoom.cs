namespace backend.Core.Entities
{
    public class NurseRoom
    {
        public int NurseId { get; set; }
        public int RoomId { get; set; }
        public Nurse Nurse { get; set; } = null!;
        public Room Room { get; set; } = null!;
    }
}
