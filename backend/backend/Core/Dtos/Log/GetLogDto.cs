using System.Data;

namespace backend.Core.Dtos.Log
{
    public class GetLogDto
    {
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public string? Description { get; set; }
    }
}
