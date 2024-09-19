using backend.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using backend.Core.Constants;
using backend.Core.Dtos.Doctor;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly IDoctorService _doctorService;

        public DoctorController(IDoctorService doctorService)
        {
            _doctorService = doctorService;
        }

        // GET: api/doctor
        [HttpGet]
        [Authorize(Roles = StaticUserRoles.AdminDoctorNurse)]
        public async Task<ActionResult<IEnumerable<DoctorDto>>> GetAllDoctors()
        {
            var doctors = await _doctorService.GetAllDoctorsAsync();
            return Ok(doctors);
        }

        // GET: api/doctor/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = StaticUserRoles.AdminDoctor)]
        public async Task<ActionResult<DoctorDto>> GetDoctorById(int id)
        {
            var doctor = await _doctorService.GetDoctorByIdAsync(id);
            if (doctor == null)
            {
                return NotFound();
            }
            return Ok(doctor);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<DoctorDto>> GetDoctorByUserId(string userId)
        {
            var doc = await _doctorService.GetDoctorByUserIdAsync(userId);

            return Ok(doc);
        }
        // POST: api/doctor
        [HttpPost]
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<ActionResult> CreateDoctor([FromBody] CUDoctorDto doctorDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var res = await _doctorService.CreateDoctorAsync(doctorDto);

            // Return the created doctor, with a 201 Created status and a location header
            return Ok(res);
        }

        // PUT: api/doctor/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = StaticUserRoles.AdminDoctor)]
        public async Task<IActionResult> UpdateDoctor(int id, [FromBody] CUDoctorDto doctorDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _doctorService.UpdateDoctorAsync(id, doctorDto);

            if (!response.IsSucceed)
            {
                if (response.StatusCode == 404)
                {
                    return NotFound(response.Message);
                }
                if (response.StatusCode == 400)
                {
                    return BadRequest(response.Message);
                }
                return StatusCode(response.StatusCode, response.Message);
            }

            return Ok(response); // 204 No Content for successful update with no content
        }


        // DELETE: api/doctor/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var doctor = await _doctorService.GetDoctorByIdAsync(id);
            if (doctor == null)
            {
                return NotFound();
            }

            await _doctorService.DeleteDoctorAsync(id);

            return NoContent(); // 204 No Content
        }

        // POST: api/doctor/{doctorId}/rooms
        [HttpPost("{doctorId}/rooms")]
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> AssignRoomsToDoctor(int doctorId, [FromBody] DoctorRoomManagementDto doctorRoomDto)
        {
            if (!ModelState.IsValid || doctorRoomDto.DoctorId != doctorId)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _doctorService.AssignRoomsToDoctorAsync(doctorRoomDto);
                return NoContent(); // 204 No Content
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/doctor/{doctorId}/rooms
        [HttpDelete("{doctorId}/rooms")]
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> RemoveRoomsFromDoctor(int doctorId, [FromBody] DoctorRoomManagementDto doctorRoomDto)
        {
            if (!ModelState.IsValid || doctorRoomDto.DoctorId != doctorId)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _doctorService.RemoveRoomsFromDoctorAsync(doctorRoomDto);
                return NoContent(); // 204 No Content
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{doctorId}/rooms")]
        public async Task<IActionResult> GetRoomsAssignedToDoctor(int doctorId)
        {
            try
            {
                var rooms = await _doctorService.GetRoomsAssignedToDoctorAsync(doctorId);
                return Ok(rooms);
            }
            catch (Exception ex)
            {
                // Log the exception (you might use a logging framework here)
                Console.WriteLine($"An error occurred while getting rooms for doctor with ID {doctorId}: {ex.Message}");

                // Return a 500 Internal Server Error response
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/doctor/department/{departmentId}
        [HttpGet("department/{departmentId}")]
        [Authorize(Roles = StaticUserRoles.AdminDoctor)]
        public async Task<ActionResult<IEnumerable<DoctorDto>>> GetDoctorsByDepartmentId(int departmentId)
        {
            var doctors = await _doctorService.GetDoctorsByDepartmentIdAsync(departmentId);
            
            return Ok(doctors);
        }

        // GET: api/doctor/noDepartment
        [HttpGet("noDepartment")]
        public async Task<ActionResult<IEnumerable<DoctorDto>>> GetDoctorsWithNoDepartment()
        {
            var doctors = await _doctorService.GetDoctorsWithNoDepartmentAsync();
            return Ok(doctors);
        }

    }
}
