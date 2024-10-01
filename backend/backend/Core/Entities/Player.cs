namespace backend.Core.Entities
{
    public class Player
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Number { get; set; }
        public int BirthYear { get; set; }
        public int TeamId { get; set; }
        public Team Team { get; set; }
    }
}
