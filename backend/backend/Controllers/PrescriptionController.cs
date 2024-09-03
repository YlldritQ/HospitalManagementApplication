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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var prescription = await _prescriptionService.GetPrescriptionByIdAsync(id);
            if (prescription == null)
            {
                return NotFound();
            }

            await _prescriptionService.UpdatePrescriptionAsync(id, prescriptionDto);

            return NoContent(); // 204 No Content
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
