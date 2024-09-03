using backend.Core.Dtos.Staff;
using backend.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicalStaffController : ControllerBase
    {
        private readonly IMedicalStaffService _medicalStaffService;

        public MedicalStaffController(IMedicalStaffService medicalStaffService)
        {
            _medicalStaffService = medicalStaffService;
        }

        // GET: api/medicalstaff
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicalStaffDto>>> GetAllMedicalStaff()
        {
            var staff = await _medicalStaffService.GetAllMedicalStaffAsync();
            return Ok(staff);
        }

        // GET: api/medicalstaff/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<MedicalStaffDto>> GetMedicalStaffById(int id)
        {
            var staff = await _medicalStaffService.GetMedicalStaffByIdAsync(id);
            if (staff == null)
            {
                return NotFound();
            }
            return Ok(staff);
        }

        // PUT: api/medicalstaff/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMedicalStaff(int id, [FromBody] MedicalStaffDto staffDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingStaff = await _medicalStaffService.GetMedicalStaffByIdAsync(id);
            if (existingStaff == null)
            {
                return NotFound();
            }

            await _medicalStaffService.UpdateMedicalStaffAsync(id, staffDto);

            return NoContent(); // 204 No Content
        }
    }
}
