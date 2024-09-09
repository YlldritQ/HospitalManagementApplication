using backend.Core.Dtos.Patient;
using backend.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly IPatientService _patientService;

        public PatientController(IPatientService patientService)
        {
            _patientService = patientService;
        }

        // GET: api/patient
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PatientDto>>> GetAllPatients()
        {
            var patients = await _patientService.GetAllPatientsAsync();
            return Ok(patients);
        }

        // GET: api/patient/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<PatientDto>> GetPatientById(int id)
        {
            var patient = await _patientService.GetPatientByIdAsync(id);
            if (patient == null)
            {
                return NotFound();
            }
            return Ok(patient);
        }

        // POST: api/patient
        [HttpPost]
        public async Task<ActionResult> CreatePatient([FromBody] CUPatientDto patientDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _patientService.CreatePatientAsync(patientDto);

            return Ok(response);
        }

        // PUT: api/patient/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatient(int id, [FromBody] CUPatientDto patientDto)
        {
            // Validate the model state
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if the patient exists
            var patient = await _patientService.GetPatientByIdAsync(id);
            if (patient == null)
            {
                return NotFound(new { Message = $"Patient with ID {id} not found." });
            }

            // Call the service to update the patient
            var response = await _patientService.UpdatePatientAsync(id, patientDto);

            // Handle the response based on the service result
            if (!response.IsSucceed)
            {
                // Return appropriate status code and message based on the response
                return StatusCode(response.StatusCode, new { Message = response.Message });
            }

            // If successful, return No Content (204)
            return Ok(response);
        }

        // DELETE: api/patient/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = await _patientService.GetPatientByIdAsync(id);
            if (patient == null)
            {
                return NotFound();
            }

            await _patientService.DeletePatientAsync(id);

            return NoContent(); // 204 No Content
        }
    }
}
