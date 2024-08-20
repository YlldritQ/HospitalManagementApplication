namespace backend.Core.Constants
{
    //this class is used to avoid typing errors
    public class StaticUserRoles
    {
        public const string OWNER = 'OWNER';
        public const string ADMIN = 'ADMIN';
        public const string MANAGER = 'MANAGER'';
        public const string USER = 'USER';

        public const OwnerAdmin = 'Owner,ADMIN';
        public const OwnerAdminManager = 'OWNER,ADMIN,MANAGER';
        public const OwnerAdminManagerUser = 'OWNER,ADMIN,MANAGER,USER';
    }
}
