namespace backend.Core.Dtos.Auth
{
    public class LoginServiceResponseDto
    {
        public string newToken { get; set; }
        public UserInfoResult UserInfo { get; set; }
    }
}
