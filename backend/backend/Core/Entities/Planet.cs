namespace backend.Core.Entities
{
    public class Planet
    {
        public int PlanetId { get; set; }

        public string Name { get; set; }

        public string Type { get; set; }

        public Boolean IsDeleted { get; set; }

        public ICollection<Satelite> Satelites { get; set; }
    }
}
