namespace backend.Core.Dtos.Auth
{
    public class UserInfoResult
    {
        public string Id { get; set;}
        public string FirstName { get; set; }   
        public string LastName { get; set;}
        public string UserName { get; set; }
        public string Email { get; set;}
        public string Gender { get; set; }
        public string Address { get; set; }
        public DateTime CreatedAt { get; set; }
        public IEnumerable<string> Roles { get; set; }
    }
}
