using backend.Core.Constants;
using backend.Core.Dtos.Appointment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AppointmentController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        // GET: api/appointment
        [HttpGet]
        [Route ("GetAllAppointments")]
        [Authorize(Roles = StaticUserRoles.AdminDoctor)]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetAllAppointments()
        {
            var appointments = await _appointmentService.GetAllAppointmentsAsync();
            return Ok(appointments);
        }
        [HttpGet("GetAppointmentsByUser/{id}")]
        [Authorize(Roles = StaticUserRoles.AdminDoctorNursePatient)]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetAppointmentsByUserId(string id)
        {
            var appointments = await _appointmentService.GetAppointmentsByUserId(id);
            return Ok(appointments);
        }

        // GET: api/appointment/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<AppointmentDto>> GetAppointmentById(int id)
        {
            var appointment = await _appointmentService.GetAppointmentByIdAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }
            return Ok(appointment);
        }

        // POST: api/appointment
        [HttpPost]
        public async Task<ActionResult> CreateAppointment([FromBody] CUAppointmentDto appointmentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var res = await _appointmentService.CreateAppointmentAsync(appointmentDto);
            return Ok(res);
        }

        // PUT: api/appointment/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, [FromBody] CUAppointmentDto appointmentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingAppointment = await _appointmentService.GetAppointmentByIdAsync(id);
            if (existingAppointment == null)
            {
                return NotFound();
            }
            
            var res = await _appointmentService.UpdateAppointmentAsync(id, appointmentDto);
            
            return Ok(res); // 204 No Content
        }

        // DELETE: api/appointment/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var existingAppointment = await _appointmentService.GetAppointmentByIdAsync(id);
            if (existingAppointment == null)
            {
                return NotFound();
            }

            await _appointmentService.DeleteAppointmentAsync(id);

            return NoContent(); // 204 No Content
        }
        
    }
}
