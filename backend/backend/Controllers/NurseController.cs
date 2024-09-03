using backend.Core.Dtos.General;
using backend.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NurseController : ControllerBase
    {
        private readonly INurseService _nurseService;

        public NurseController(INurseService nurseService)
        {
            _nurseService = nurseService;
        }

        // GET: api/nurse
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NurseDto>>> GetAllNurses()
        {
            var nurses = await _nurseService.GetAllNursesAsync();
            return Ok(nurses);
        }

        // GET: api/nurse/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<NurseDto>> GetNurseById(int id)
        {
            var nurse = await _nurseService.GetNurseByIdAsync(id);
            if (nurse == null)
            {
                return NotFound();
            }
            return Ok(nurse);
        }

        // POST: api/nurse
        [HttpPost]
        public async Task<ActionResult<NurseDto>> CreateNurse([FromBody] NurseDto nurseDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _nurseService.CreateNurseAsync(nurseDto);

            // Return the created nurse, with a 201 Created status and a location header
            return CreatedAtAction(nameof(GetNurseById), new { id = nurseDto.Id }, nurseDto);
        }

        // PUT: api/nurse/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNurse(int id, [FromBody] NurseDto nurseDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var nurse = await _nurseService.GetNurseByIdAsync(id);
            if (nurse == null)
            {
                return NotFound();
            }

            await _nurseService.UpdateNurseAsync(id, nurseDto);

            return NoContent(); // 204 No Content
        }

        // DELETE: api/nurse/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNurse(int id)
        {
            var nurse = await _nurseService.GetNurseByIdAsync(id);
            if (nurse == null)
            {
                return NotFound();
            }

            await _nurseService.DeleteNurseAsync(id);

            return NoContent(); // 204 No Content
        }

        // POST: api/nurse/{nurseId}/rooms
        [HttpPost("{nurseId}/rooms")]
        public async Task<IActionResult> AssignRoomsToNurse(int nurseId, [FromBody] NurseRoomAssignmentDto assignmentDto)
        {
            if (!ModelState.IsValid || assignmentDto.NurseId != nurseId)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _nurseService.AssignRoomsToNurseAsync(assignmentDto);
                return NoContent(); // 204 No Content
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/nurse/{nurseId}/rooms
        [HttpDelete("{nurseId}/rooms")]
        public async Task<IActionResult> RemoveRoomsFromNurse(int nurseId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _nurseService.RemoveRoomsFromNurseAsync(nurseId);
                return NoContent(); // 204 No Content
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
