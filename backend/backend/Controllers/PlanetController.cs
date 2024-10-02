using AutoMapper;
using backend.Core.DbContext;
using backend.Core.Dtos;
using backend.Core.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlanetController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public PlanetController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TeamDto>>> GetAllPlanets()
        {
            var planets = await _context.Planets
           .AsNoTracking()
           .ToListAsync();

            return Ok(_mapper.Map<IEnumerable<PlanetDto>>(planets));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PlanetDto>> GetPlanetById(int id)
        {
            var planet = await _context.Planets
          .AsNoTracking()
          .Include(d => d.Satelites)
          .FirstOrDefaultAsync(d => d.PlanetId == id);

            if (planet == null)
            {
                throw new ArgumentException($"Planet with ID {id} not found.");
            }

            return Ok(_mapper.Map<PlanetDto>(planet));
        }

        [HttpPost]
        public async Task<IActionResult> CreatePlanet([FromBody] CUPlanetDto planetDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var planet = _mapper.Map<Planet>(planetDto);

            await _context.Planets.AddAsync(planet);
            await _context.SaveChangesAsync();
            return Ok("Success");

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePlanet(int id, [FromBody] CUPlanetDto planet)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var RetPlanet = await _context.Planets
                .FirstOrDefaultAsync(d => d.PlanetId == id);

            if (RetPlanet == null)
            {
                throw new ArgumentException("Error");
            }
            _mapper.Map(planet, RetPlanet);

            // Save changes to the database.
            await _context.SaveChangesAsync();
            return Ok("Success"); // 204 No Content for successful update
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlanet(int id)
        {
            var planet = await _context.Planets
           .Include(d => d.Satelites)
           .FirstOrDefaultAsync(d => d.PlanetId == id);

            _context.Teams.Remove(planet);
            await _context.SaveChangesAsync();

            return NoContent(); // 204 No Content
        }
    }
}
