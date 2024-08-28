using backend.Core.Constants;
using backend.Core.Dtos.General;
using backend.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicalRecordController : ControllerBase
    {
        private readonly IMedicalRecordService _medicalRecordService;

        public MedicalRecordController(IMedicalRecordService medicalRecordService)
        {
            _medicalRecordService = medicalRecordService;
        }

        // GET: api/medicalrecord
        [HttpGet]
        [Authorize(Roles = StaticUserRoles.AdminDoctorNurseUser)]
        public async Task<ActionResult<IEnumerable<MedicalRecordDto>>> GetAllMedicalRecords()
        {
            var records = await _medicalRecordService.GetAllMedicalRecordsAsync();
            return Ok(records);
        }

        // GET: api/medicalrecord/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<MedicalRecordDto>> GetMedicalRecordById(int id)
        {
            var record = await _medicalRecordService.GetMedicalRecordByIdAsync(id);
            if (record == null)
            {
                return NotFound();
            }
            return Ok(record);
        }

        // POST: api/medicalrecord
        [HttpPost]
        public async Task<ActionResult<MedicalRecordDto>> CreateMedicalRecord([FromBody] MedicalRecordDto recordDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _medicalRecordService.CreateMedicalRecordAsync(recordDto);
            return CreatedAtAction(nameof(GetMedicalRecordById), new { id = recordDto.Id }, recordDto);
        }

        // PUT: api/medicalrecord/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMedicalRecord(int id, [FromBody] MedicalRecordDto recordDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingRecord = await _medicalRecordService.GetMedicalRecordByIdAsync(id);
            if (existingRecord == null)
            {
                return NotFound();
            }

            await _medicalRecordService.UpdateMedicalRecordAsync(id, recordDto);

            return NoContent(); // 204 No Content
        }

        // DELETE: api/medicalrecord/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedicalRecord(int id)
        {
            var existingRecord = await _medicalRecordService.GetMedicalRecordByIdAsync(id);
            if (existingRecord == null)
            {
                return NotFound();
            }

            await _medicalRecordService.DeleteMedicalRecordAsync(id);

            return NoContent(); // 204 No Content
        }
    }
}
