using backend.Core.Constants;
using backend.Core.DbContext;
using backend.Core.Dtos.Auth;
using backend.Core.Dtos.General;
using backend.Core.Entities;
using backend.Core.Dtos.Patient;
using backend.Core.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Core.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ILogService _logService;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public AuthService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, ILogService logService, IConfiguration configuration, ApplicationDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _logService = logService;
            _configuration = configuration;
            _context = context;
        }

        public async Task<GeneralServiceResponseDto> SeedRolesAsync()
        {
            bool isAdminRoleExists = await _roleManager.RoleExistsAsync(StaticUserRoles.ADMIN);
            bool isUserRoleExists = await _roleManager.RoleExistsAsync(StaticUserRoles.USER);
            bool isDoctorRoleExists = await _roleManager.RoleExistsAsync(StaticUserRoles.DOCTOR);
            bool isNurseRoleExists = await _roleManager.RoleExistsAsync(StaticUserRoles.NURSE);
            bool isPatientRoleExists = await _roleManager.RoleExistsAsync(StaticUserRoles.PATIENT);

            if (isAdminRoleExists && isUserRoleExists && isDoctorRoleExists && isNurseRoleExists && isPatientRoleExists)
                return new GeneralServiceResponseDto()
                {
                    IsSucceed = true,
                    StatusCode = 200,
                    Message = "Roles Seeding is Already Done"
                };

            await _roleManager.CreateAsync(new IdentityRole(StaticUserRoles.ADMIN));
            await _roleManager.CreateAsync(new IdentityRole(StaticUserRoles.USER));
            await _roleManager.CreateAsync(new IdentityRole(StaticUserRoles.DOCTOR));
            await _roleManager.CreateAsync(new IdentityRole(StaticUserRoles.NURSE));
            await _roleManager.CreateAsync(new IdentityRole(StaticUserRoles.PATIENT));

            return new GeneralServiceResponseDto()
            {
                IsSucceed = true,
                StatusCode = 201,
                Message = "Roles Seeding Done Successfully"
            };
        }

       public async Task<GeneralServiceResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            var isExistsUser = await _userManager.FindByNameAsync(registerDto.UserName);
            if (isExistsUser is not null)
                return new GeneralServiceResponseDto()
                {
                    IsSucceed = false,
                    StatusCode = 409,
                    Message = "UserName Already Exists"
                };

            ApplicationUser newUser = new ApplicationUser()
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Email = registerDto.Email,
                UserName = registerDto.UserName,
                Address = registerDto.Address,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var createUserResult = await _userManager.CreateAsync(newUser, registerDto.Password);

            if (!createUserResult.Succeeded)
            {
                var errorString = "User Creation failed because: ";
                foreach (var error in createUserResult.Errors)
                {
                    errorString += " # " + error.Description;
                }
                return new GeneralServiceResponseDto()
                {
                    IsSucceed = false,
                    StatusCode = 400,
                    Message = errorString
                };
            }

            // Assign the "Patient" role and create a corresponding Patient entry
            await _userManager.AddToRoleAsync(newUser, StaticUserRoles.PATIENT);

            var newPatient = new Patient()
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                DateOfBirth = DateTime.Now, // Adjust as needed
                Gender = "Unknown", // Adjust as needed
                ContactInfo = "N/A", // Adjust as needed
                UserId = newUser.Id
            };
            Console.WriteLine(newPatient);

            _context.Patients.Add(newPatient);
            await _context.SaveChangesAsync();

            await _logService.SaveNewLog(newUser.UserName, "Registered as Patient");

            return new GeneralServiceResponseDto()
            {
                IsSucceed = true,
                StatusCode = 201,
                Message = "User Created Successfully as Patient"
            };
        }

        public async Task<LoginServiceResponseDto?> LoginAsync(LoginDto loginDto)
        {
            // Find user with username
            var user = await _userManager.FindByNameAsync(loginDto.UserName);
            if (user is null)
                return null;

            // check password of user
            var isPasswordCorrect = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!isPasswordCorrect)
                return null;

            // Return Token and userInfo to front-end
            var newToken = await GenerateJWTTokenAsync(user);
            var roles = await _userManager.GetRolesAsync(user);
            var userInfo = GenerateUserInfoObject(user, roles);
            await _logService.SaveNewLog(user.UserName, "New Login");

            return new LoginServiceResponseDto()
            {
                NewToken = newToken,
                UserInfo = userInfo
            };
        }

        public async Task<GeneralServiceResponseDto> UpdateRoleAsync(ClaimsPrincipal User, UpdateRoleDto updateRoleDto)
        {
            var user = await _userManager.FindByNameAsync(updateRoleDto.UserName);
            if (user is null)
                return new GeneralServiceResponseDto()
                {
                    IsSucceed = false,
                    StatusCode = 404,
                    Message = "Invalid UserName"
                };

            var userRoles = await _userManager.GetRolesAsync(user);
            if (User.IsInRole(StaticUserRoles.ADMIN))
            {
                if (updateRoleDto.NewRole == RoleType.USER || updateRoleDto.NewRole == RoleType.DOCTOR ||
                    updateRoleDto.NewRole == RoleType.NURSE || updateRoleDto.NewRole == RoleType.PATIENT)
                {
                    if (userRoles.Any(q => q.Equals(StaticUserRoles.ADMIN)))
                    {
                        return new GeneralServiceResponseDto()
                        {
                            IsSucceed = false,
                            StatusCode = 403,
                            Message = "You are not allowed to change role of this user"
                        };
                    }
                    else
                    {
                        // Handle transition from one role to another
                        if (userRoles.Contains(StaticUserRoles.PATIENT) && updateRoleDto.NewRole == RoleType.DOCTOR)
                        {
                            // Remove from Patient table
                            var existingPatient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == user.Id);
                            if (existingPatient != null)
                            {
                                _context.Patients.Remove(existingPatient);
                            }

                            // Add to Doctor table
                            var newDoctor = new Doctor
                            {
                                FirstName = user.FirstName,
                                LastName = user.LastName,
                                DateOfBirth = existingPatient.DateOfBirth, // Adjust as needed
                                Gender =existingPatient.Gender, // Adjust as needed
                                ContactInfo = existingPatient.ContactInfo, // Adjust as needed
                                UserId = user.Id,
                                Specialty = "General", // Adjust as needed
                                Qualifications = "MD", // Adjust as needed
                                IsAvailable = true // Adjust as needed
                            };

                            _context.Doctors.Add(newDoctor);
                            await _context.SaveChangesAsync();
                        }
                        else if (userRoles.Contains(StaticUserRoles.DOCTOR) && updateRoleDto.NewRole == RoleType.PATIENT)
                        {
                            // Remove from Doctor table
                            var existingDoctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == user.Id);
                            if (existingDoctor != null)
                            {
                                _context.Doctors.Remove(existingDoctor);
                            }

                            // Add to Patient table
                            var newPatient = new Patient
                            {
                                FirstName = user.FirstName,
                                LastName = user.LastName,
                                DateOfBirth = existingDoctor.DateOfBirth, // Adjust as needed
                                Gender = existingDoctor.Gender, // Adjust as needed
                                ContactInfo = existingDoctor.ContactInfo, // Adjust as needed
                                UserId = user.Id
                            };

                            _context.Patients.Add(newPatient);
                            await _context.SaveChangesAsync();
                        }
                        else if (userRoles.Contains(StaticUserRoles.NURSE) && updateRoleDto.NewRole == RoleType.PATIENT)
                        {
                            // Remove from Nurse table
                            var existingNurse = await _context.Nurses.FirstOrDefaultAsync(n => n.UserId == user.Id);
                            if (existingNurse != null)
                            {
                                _context.Nurses.Remove(existingNurse);
                            }

                            // Add to Patient table
                            var newPatient = new Patient
                            {
                                FirstName = user.FirstName,
                                LastName = user.LastName,
                                DateOfBirth = existingNurse.DateOfBirth, // Adjust as needed
                                Gender = existingNurse.Gender, // Adjust as needed
                                ContactInfo = existingNurse.ContactInfo, // Adjust as needed
                                UserId = user.Id
                            };

                            _context.Patients.Add(newPatient);
                            await _context.SaveChangesAsync();
                        }
                        else if (userRoles.Contains(StaticUserRoles.PATIENT) && updateRoleDto.NewRole == RoleType.NURSE)
                        {
                            // Remove from Patient table
                            var existingPatient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == user.Id);
                            if (existingPatient != null)
                            {
                                _context.Patients.Remove(existingPatient);
                            }

                            // Add to Nurse table
                            var newNurse = new Nurse
                            {
                                FirstName = user.FirstName,
                                LastName = user.LastName,
                                DateOfBirth = existingPatient.DateOfBirth, // Adjust as needed
                                Gender = existingPatient.Gender, // Adjust as needed
                                ContactInfo = existingPatient.ContactInfo, // Adjust as needed
                                UserId = user.Id,
                                Qualifications = "RN", // Adjust as needed
                                IsAvailable = true // Adjust as needed
                            };

                            _context.Nurses.Add(newNurse);
                            await _context.SaveChangesAsync();
                        }
                        else if (userRoles.Contains(StaticUserRoles.DOCTOR) && updateRoleDto.NewRole == RoleType.NURSE)
                        {
                            // Remove from Doctor table
                            var existingDoctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == user.Id);
                            if (existingDoctor != null)
                            {
                                _context.Doctors.Remove(existingDoctor);
                            }

                            // Add to Nurse table
                            var newNurse = new Nurse
                            {
                                FirstName = existingDoctor.FirstName,
                                LastName = existingDoctor.LastName,
                                DateOfBirth = existingDoctor.DateOfBirth, // Adjust as needed
                                Gender = existingDoctor.Gender, // Adjust as needed
                                ContactInfo = existingDoctor.ContactInfo, // Adjust as needed
                                UserId = user.Id,
                                Qualifications = existingDoctor.Qualifications, // Adjust as needed
                                IsAvailable = true // Adjust as needed
                            };

                            _context.Nurses.Add(newNurse);
                            await _context.SaveChangesAsync();
                        }
                        else if (userRoles.Contains(StaticUserRoles.NURSE) && updateRoleDto.NewRole == RoleType.DOCTOR)
                        {
                            // Remove from Nurse table
                            var existingNurse = await _context.Nurses.FirstOrDefaultAsync(d => d.UserId == user.Id);
                            if (existingNurse != null)
                            {
                                _context.Nurses.Remove(existingNurse);
                            }

                            // Add to Doctor table
                            var newDoctor = new Doctor
                            {
                                FirstName = existingNurse.FirstName,
                                LastName = existingNurse.LastName,
                                DateOfBirth = existingNurse.DateOfBirth, // Adjust as needed
                                Gender = existingNurse.Gender, // Adjust as needed
                                ContactInfo = existingNurse.ContactInfo, // Adjust as needed
                                UserId = user.Id,
                                Specialty = "General",
                                Qualifications = existingNurse.Qualifications, // Adjust as needed
                                IsAvailable = true // Adjust as needed
                            };

                            _context.Doctors.Add(newDoctor);
                            await _context.SaveChangesAsync();
                        }

                        await _userManager.RemoveFromRolesAsync(user, userRoles);
                        await _userManager.AddToRoleAsync(user, updateRoleDto.NewRole.ToString());
                        await _logService.SaveNewLog(user.UserName, "User Roles Updated");

                        return new GeneralServiceResponseDto()
                        {
                            IsSucceed = true,
                            StatusCode = 200,
                            Message = "Role updated successfully"
                        };
                    }
                }
                else
                {
                    return new GeneralServiceResponseDto()
                    {
                        IsSucceed = false,
                        StatusCode = 403,
                        Message = "You are not allowed to change the role of this user"
                    };
                }
            }

            return new GeneralServiceResponseDto()
            {
                IsSucceed = false,
                StatusCode = 403,
                Message = "You are not authorized to perform this action"
            };
        }

        public async Task<LoginServiceResponseDto?> MeAsync(MeDto meDto)
        {
            ClaimsPrincipal handler = new JwtSecurityTokenHandler().ValidateToken(meDto.Token, new TokenValidationParameters()
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidIssuer = _configuration["JWT:ValidIssuer"],
                ValidAudience = _configuration["JWT:ValidAudience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]))
            }, out SecurityToken securityToken);

            string decodedUserName = handler.Claims.First(q => q.Type == ClaimTypes.Name).Value;
            if (decodedUserName is null)
                return null;

            var user = await _userManager.FindByNameAsync(decodedUserName);
            if (user is null)
                return null;

            var newToken = await GenerateJWTTokenAsync(user);
            var roles = await _userManager.GetRolesAsync(user);
            var userInfo = GenerateUserInfoObject(user, roles);
            await _logService.SaveNewLog(user.UserName, "New Token Generated");

            return new LoginServiceResponseDto()
            {
                NewToken = newToken,
                UserInfo = userInfo
            };
        }

        public async Task<IEnumerable<UserInfoResult>> GetUsersListAsync()
        {
            var users = await _userManager.Users.ToListAsync();

            List<UserInfoResult> userInfoResults = new List<UserInfoResult>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var userInfo = GenerateUserInfoObject(user, roles);
                userInfoResults.Add(userInfo);
            }

            return userInfoResults;
        }

        public async Task<UserInfoResult?> GetUserDetailsByUserNameAsync(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            if (user is null)
                return null;

            var roles = await _userManager.GetRolesAsync(user);
            var userInfo = GenerateUserInfoObject(user, roles);
            return userInfo;
        }

        public async Task<IEnumerable<string>> GetUsernamesListAsync()
        {
            var userNames = await _userManager.Users
                .Select(q => q.UserName)
                .ToListAsync();

            return userNames;
        }

        //GenerateJWTTokenAsync
        private async Task<string> GenerateJWTTokenAsync(ApplicationUser user)
        {
            var userRoles = await _userManager.GetRolesAsync(user);

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim("FirstName", user.FirstName),
                new Claim("LastName", user.LastName),
            };

            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            var authSecret = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
            var signingCredentials = new SigningCredentials(authSecret, SecurityAlgorithms.HmacSha256);

            var tokenObject = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                notBefore: DateTime.Now,
                expires: DateTime.Now.AddHours(3),
                claims: authClaims,
                signingCredentials: signingCredentials
                );

            string token = new JwtSecurityTokenHandler().WriteToken(tokenObject);
            return token;
        }

        //GenerateUserInfoObject
        private UserInfoResult GenerateUserInfoObject(ApplicationUser user, IEnumerable<string> Roles)
        {
            return new UserInfoResult()
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName,
                Email = user.Email,
                CreatedAt = user.CreatedAt,
                Roles = Roles
            };
        }
        public async Task<GeneralServiceResponseDto> DeleteUserAsync(ClaimsPrincipal User, string UserName)
        {
            var user = await _userManager.FindByNameAsync(UserName);
            if (user is null)
                return new GeneralServiceResponseDto()
                {
                    IsSucceed = false,
                    StatusCode = 409,
                    Message = "User with given username does not exist"
                };
            var userRoles = await _userManager.GetRolesAsync(user);

            // User is admin
            if (User.IsInRole(StaticUserRoles.ADMIN))
            {
                if (userRoles.Count > 0 && !userRoles[0].Equals(StaticUserRoles.ADMIN))
                {
                    var DelUser = await _userManager.DeleteAsync(user);
                    if (!DelUser.Succeeded)
                    {
                        var errorString = "User Deletion failed because: ";
                        foreach (var error in DelUser.Errors)
                        {
                            errorString += " # " + error.Description;
                        }
                        return new GeneralServiceResponseDto()
                        {
                            IsSucceed = false,
                            StatusCode = 400,
                            Message = errorString
                        };
                    }
                    await _logService.SaveNewLog(UserName, "Deleted from Website");

                    return new GeneralServiceResponseDto()
                    {
                        IsSucceed = true,
                        StatusCode = 201,
                        Message = "User Deleted Successfully"
                    };
                }
            }
            
            return new GeneralServiceResponseDto()
            {
                IsSucceed = false,
                StatusCode = 403,
                Message = "You are not allowed to delete this user"
            };
        } 
    }
}