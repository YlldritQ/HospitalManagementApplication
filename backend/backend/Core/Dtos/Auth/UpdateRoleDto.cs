using System.ComponentModel.DataAnnotations;

namespace backend.Core.Dtos.Auth
{
    public class UpdateRoleDto
    {
        [Required(ErrorMessage = "Username is required")]
        public string UserName { get; set; }
        public RoleType NewRole { get; set; }

    }

    public enum RoleType
    {
        ADMIN,
        MANAGER,
        USER
    }
}
