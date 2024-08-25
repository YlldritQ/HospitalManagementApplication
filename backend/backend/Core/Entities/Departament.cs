using System.Collections.Generic;

namespace backend.Core.Entities
{
    public class Department
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;

        // Navigation property
        public ICollection<Doctor> Doctors { get; set; } = new List<Doctor>();
        public ICollection<Nurse> Nurses { get; set; } = new List<Nurse>();
    }
}
