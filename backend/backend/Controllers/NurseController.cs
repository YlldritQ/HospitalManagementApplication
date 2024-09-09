using backend.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using backend.Core.Dtos.Nurse;

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
        public async Task<ActionResult> CreateNurse([FromBody] CUNurseDto nurseDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var res = await _nurseService.CreateNurseAsync(nurseDto);

            // Return the created nurse, with a 201 Created status and a location header
            return Ok(res);
        }

        // PUT: api/nurse/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNurse(int id, [FromBody] CUNurseDto nurseDto)
        {
            // Validate the model state
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if the nurse exists
            var nurse = await _nurseService.GetNurseByIdAsync(id);
            if (nurse == null)
            {
                return NotFound(new { Message = $"Nurse with ID {id} not found." });
            }

            // Call the service to update the nurse
            var response = await _nurseService.UpdateNurseAsync(id, nurseDto);

            // Handle the response based on the service result
            if (!response.IsSucceed)
            {
                // Return appropriate status code based on the response
                return StatusCode(response.StatusCode, new { Message = response.Message });
            }

            // If successful, return No Content (204)
            return Ok(response);
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
