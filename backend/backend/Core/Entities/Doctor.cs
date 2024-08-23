﻿namespace backend.Core.Entities
{
    public class Doctor : MedicalStaff
    {
        public string Specialty { get; set; } = null!;
        public string Qualifications { get; set; } = null!;
        public bool IsAvailable { get; set; }
    }
}
