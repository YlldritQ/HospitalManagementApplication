using backend.Core.Dtos.Prescription;
using backend.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrescriptionController : ControllerBase
    {
        private readonly IPrescriptionService _prescriptionService;

        public PrescriptionController(IPrescriptionService prescriptionService)
        {
            _prescriptionService = prescriptionService;
        }

        // GET: api/prescription
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PrescriptionDto>>> GetAllPrescriptions()
        {
            var prescriptions = await _prescriptionService.GetAllPrescriptionsAsync();
            return Ok(prescriptions);
        }

        // GET: api/prescription/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<PrescriptionDto>> GetPrescriptionById(int id)
        {
            var prescription = await _prescriptionService.GetPrescriptionByIdAsync(id);
            if (prescription == null)
            {
                return NotFound();
            }
            return Ok(prescription);
        }

        // POST: api/prescription
        [HttpPost]
        public async Task<ActionResult> CreatePrescription([FromBody] CUPrescriptionDto prescriptionDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _prescriptionService.CreatePrescriptionAsync(prescriptionDto);

            return Ok(response);
        }

        // PUT: api/prescription/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePrescription(int id, [FromBody] CUPrescriptionDto prescriptionDto)
        {
            // Validate the model state
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Fetch the existing prescription to ensure it exists
            var existingPrescription = await _prescriptionService.GetPrescriptionByIdAsync(id);
            if (existingPrescription == null)
            {
                return NotFound(new { Message = $"Prescription with ID {id} not found." });
            }

            // Call the service to update the prescription
            var response = await _prescriptionService.UpdatePrescriptionAsync(id, prescriptionDto);

            // Handle the response based on the service result
            if (!response.IsSucceed)
            {
                // Return appropriate status code and message based on the response
                return StatusCode(response.StatusCode, new { Message = response.Message });
            }

            // If successful, return No Content (204)
            return NoContent();
        }

        // DELETE: api/prescription/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePrescription(int id)
        {
            var prescription = await _prescriptionService.GetPrescriptionByIdAsync(id);
            if (prescription == null)
            {
                return NotFound();
            }

            await _prescriptionService.DeletePrescriptionAsync(id);

            return NoContent(); // 204 No Content
        }
    }
}
