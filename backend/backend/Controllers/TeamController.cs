using AutoMapper;
using Azure;
using backend.Core.Constants;
using backend.Core.DbContext;
using backend.Core.Dtos;
using backend.Core.Dtos.Department;
using backend.Core.Dtos.General;
using backend.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public TeamController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TeamDto>>> GetAllTeams()
        {
            var teams = await _context.Teams
           .AsNoTracking()
           .ToListAsync();

            return Ok(_mapper.Map<IEnumerable<TeamDto>>(teams));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TeamDto>> GetTeamsById(int id)
        {
            var team = await _context.Teams
          .AsNoTracking()
          .Include(d => d.Players)
          .FirstOrDefaultAsync(d => d.Id == id);

            if (team == null)
            {
                throw new ArgumentException($"Team with ID {id} not found.");
            }

            return Ok(_mapper.Map<TeamDto>(team));
        }

        [HttpPost]
        public async Task<IActionResult> CreateTeam([FromBody] CUTeamDto teamDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var team = _mapper.Map<Team>(teamDto);

            await _context.Teams.AddAsync(team);
            await _context.SaveChangesAsync();
            return Ok("Success");

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDepartment(int id, [FromBody] CUTeamDto team)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var RetTeam = await _context.Teams
                .FirstOrDefaultAsync(d => d.Id == id);
            
            if (RetTeam == null)
            {
                throw new ArgumentException("Error");
            }
            _mapper.Map(team, RetTeam);

            // Save changes to the database.
            await _context.SaveChangesAsync();
            return Ok("Success"); // 204 No Content for successful update
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeam(int id)
        {
            var team = await _context.Teams
           .Include(d => d.Players)
           .FirstOrDefaultAsync(d => d.Id == id);

            _context.Teams.Remove(team);
            await _context.SaveChangesAsync();

            return NoContent(); // 204 No Content
        }
    }
}
