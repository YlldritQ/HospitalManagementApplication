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
        [Authorize(Roles = StaticUserRoles.AdminDoctor)]
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

            var doctor = await _doctorService.GetDoctorByIdAsync(id);
            if (doctor == null)
            {
                return NotFound();
            }

            await _doctorService.UpdateDoctorAsync(id, doctorDto);

            return NoContent(); // 204 No Content
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
    }
}
