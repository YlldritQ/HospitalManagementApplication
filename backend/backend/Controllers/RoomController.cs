using backend.Core.Dtos.Room;
using backend.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly IRoomService _roomService;

        public RoomController(IRoomService roomService)
        {
            _roomService = roomService;
        }

        // GET: api/room
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomDto>>> GetAllRooms()
        {
            var rooms = await _roomService.GetAllRoomsAsync();
            return Ok(rooms);
        }

        // GET: api/room/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<RoomDto>> GetRoomById(int id)
        {
            var room = await _roomService.GetRoomByIdAsync(id);
            if (room == null)
            {
                return NotFound();
            }
            return Ok(room);
        }

        // GET: api/room/unassignedDocs
        [HttpGet("unassignedDocs")]
        public async Task<ActionResult<IEnumerable<RoomDto>>> GetUnassignedRooms()
        {
            var unassignedRooms = await _roomService.GetUnassignedRoomsToDoctorsAsync();
            return Ok(unassignedRooms);
        }

        // GET: api/room/unassignedNurses
        [HttpGet("unassignedNurses")]
        public async Task<ActionResult<IEnumerable<RoomDto>>> GetUnassignedRoomsToNurses()
        {
            var unassignedRooms = await _roomService.GetUnassignedRoomsToNursesAsync();
            return Ok(unassignedRooms);
        }

        // POST: api/room
        [HttpPost]
        public async Task<ActionResult> CreateRoom([FromBody] CURoomDto roomDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _roomService.CreateRoomAsync(roomDto);

            // Return the created room, with a 201 Created status and a location header
            return Ok(response);
        }

        // PUT: api/room/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoom(int id, [FromBody] CURoomDto roomDto)
        {
            // Validate the model state
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Fetch the existing room to ensure it exists
            var existingRoom = await _roomService.GetRoomByIdAsync(id);
            if (existingRoom == null)
            {
                return NotFound(new { Message = $"Room with ID {id} not found." });
            }

            // Call the service to update the room
            var response = await _roomService.UpdateRoomAsync(id, roomDto);

            // Handle the response based on the service result
            if (!response.IsSucceed)
            {
                // Return appropriate status code and message based on the response
                return StatusCode(response.StatusCode, new { Message = response.Message });
            }

            // If successful, return No Content (204)
            return Ok(response);
        }

        // DELETE: api/room/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var room = await _roomService.GetRoomByIdAsync(id);
            if (room == null)
            {
                return NotFound();
            }

            await _roomService.DeleteRoomAsync(id);

            return NoContent(); // 204 No Content
        }
    }
}
