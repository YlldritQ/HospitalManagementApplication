using AutoMapper;
using backend.Core.DbContext;
using backend.Core.Dtos;
using backend.Core.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SateliteController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public SateliteController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SateliteDto>>> GetAllSatelites()
        {
            var satelites = await _context.Satelite
                .AsNoTracking()
                .ToListAsync();

            return Ok(_mapper.Map<IEnumerable<PlayerDto>>(satelites));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SateliteDto>> GetSateliteById(int id)
        {
            var satelite = await _context.Satelites
          .AsNoTracking()
          .FirstOrDefaultAsync(d => d.SateliteId == id);

            if (satelite == null)
            {
                throw new ArgumentException($"Satelite with ID {id} not found.");
            }

            return Ok(_mapper.Map<SateliteDto>(satelite));
        }
        [HttpPost]
        public async Task<IActionResult> CreateSatelite([FromBody] CUSateliteDto PlanetDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var team = _mapper.Map<Satelite>(PlanetDto);

            await _context.Satelites.AddAsync(team);
            await _context.SaveChangesAsync();
            return Ok("Success");

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePlayer(int id, [FromBody] CUSateliteDto team)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var RetTeam = await _context.Satelites
                .FirstOrDefaultAsync(d => d.SateliteId == id);

            if (RetTeam == null)
            {
                throw new ArgumentException("Error");
            }

            var retTeam = await _context.Planets
                .FirstOrDefaultAsync(d => d.Id == team.PlanetId);
            if (retTeam == null)
            {
                throw new ArgumentException("Error");
            }
            _mapper.Map(team, RetTeam);

            // Save changes to the database.
            await _context.SaveChangesAsync();
            return Ok("Success"); // 204 No Content for successful update
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSatelite(int id)
        {
            var team = await _context.Satelites
           .FirstOrDefaultAsync(d => d.Id == id);

            _context.Players.Remove(team);
            await _context.SaveChangesAsync();

            return NoContent(); // 204 No Content
        }
    }
}

