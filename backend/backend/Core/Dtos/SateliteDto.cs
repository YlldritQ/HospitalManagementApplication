using backend.Core.Entities;

namespace backend.Core.Dtos
{
    public class SateliteDto
    {
        public int SateliteId { get; set; }
        public string Name { get; set; }


        public Boolean IsDeleted { get; set; }

        public int PlanetId { get; set; }
    }
}
