using backend.Core.Dtos.Auth;
using backend.Core.Dtos.General;
using System.Security.Claims;

namespace backend.Core.Interfaces
{
    public interface IAuthService
    {
        Task<GeneralServiceResponseDto> SeedRolesAsync();
        Task<GeneralServiceResponseDto> RegisterAsync(RegisterDto registerDto);
        Task<LoginServiceResponseDto?> LoginAsync(LoginDto loginDto);
        Task<GeneralServiceResponseDto> UpdateRoleAsync(ClaimsPrincipal User, UpdateRoleDto updateRoleDto);
        Task<LoginServiceResponseDto?> MeAsync(MeDto meDto);
        Task<IEnumerable<UserInfoResult>> GetUsersListAsync();
        Task<UserInfoResult?> GetUserDetailsByUserNameAsync(string userName);
        Task<GeneralServiceResponseDto> UpdateUserAsync(string id, UpdateDto update);
        Task<IEnumerable<string>> GetUsernamesListAsync();
        Task<GeneralServiceResponseDto> DeleteUserAsync(ClaimsPrincipal User, string UserName);
    }
}