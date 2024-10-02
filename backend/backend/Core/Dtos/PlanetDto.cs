namespace backend.Core.Dtos
{
    public class PlanetDto
    {
        public int? PlanetId { get; set; }
        public string Name { get; set; }

        public string Type { get; set; }

        public Boolean IsDeleted { get; set; }

    }
}
