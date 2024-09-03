using backend.Core.Entities;

namespace backend.Core.Dtos.General
{
    public class NurseDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Gender { get; set; } = null!;
        public string ContactInfo { get; set; } = null!;
        public DateTime DateOfBirth { get; set; }
        public DateTime DateHired { get; set; }
        public string Qualifications { get; set; } = null!;
        public bool IsAvailable { get; set; }
        public int DepartmentId { get; set; }
        //public List<NurseRoomDto> NurseRooms { get; set; }
    }
}
