namespace backend.Core.Constants
{
    //this class is used to avoid typing errors
    public class StaticUserRoles
    {
        public const string ADMIN = "Admin";
        public const string USER = "User";
        public const string DOCTOR = "Doctor";
        public const string NURSE = "Nurse";
        public const string PATIENT = "Patient";

        public const string AdminDoctor = "Admin,Doctor";
        public const string AdminDoctorNurseUser = "Admin,Doctor,Nurse,User";

    }
}
