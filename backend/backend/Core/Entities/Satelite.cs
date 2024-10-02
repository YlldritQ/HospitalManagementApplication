namespace backend.Core.Entities
{
    public class Satelite
    {
        public int SateliteId { get; set; }
        public string Name { get; set; }


        public Boolean IsDeleted { get; set; }

        public int PlanetId { get; set; }
        public Planet Planet { get; set; }

    }
}
