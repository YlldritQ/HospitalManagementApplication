using AutoMapper;
using backend.Core.Constants;
using backend.Core.DbContext;
using backend.Core.Dtos;
using backend.Core.Dtos.Doctor;
using backend.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlayerController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public PlayerController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PlayerDto>>> GetAllPlayers()
        {
            var players = await _context.Players
                .AsNoTracking()
                .ToListAsync();

            return Ok(_mapper.Map<IEnumerable<PlayerDto>>(players));
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<PlayerDto>> GetPlayersById(int id)
        {
            var team = await _context.Players
          .AsNoTracking()
          .FirstOrDefaultAsync(d => d.Id == id);

            if (team == null)
            {
                throw new ArgumentException($"Player with ID {id} not found.");
            }

            return Ok(_mapper.Map<PlayerDto>(team));
        }
        [HttpPost]
        public async Task<IActionResult> CreatePlayer([FromBody] CUPlayerDto teamDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var team = _mapper.Map<Player>(teamDto);

            await _context.Players.AddAsync(team);
            await _context.SaveChangesAsync();
            return Ok("Success");

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePlayer(int id, [FromBody] CUPlayerDto team)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var RetTeam = await _context.Players
                .FirstOrDefaultAsync(d => d.Id == id);

            if (RetTeam == null)
            {
                throw new ArgumentException("Error");
            }

            var retTeam = await _context.Teams
                .FirstOrDefaultAsync(d => d.Id == team.TeamId);
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
        public async Task<IActionResult> DeletePlayer(int id)
        {
            var team = await _context.Players
           .FirstOrDefaultAsync(d => d.Id == id);

            _context.Players.Remove(team);
            await _context.SaveChangesAsync();

            return NoContent(); // 204 No Content
        }
    }
}
