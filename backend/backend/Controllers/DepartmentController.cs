using backend.Core.Constants;
using backend.Core.Dtos.Department;
using backend.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentService _departmentService;

        public DepartmentController(IDepartmentService departmentService)
        {
            _departmentService = departmentService;
        }

        // GET: api/department
        [HttpGet]
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<ActionResult<IEnumerable<DepartmentDto>>> GetAllDepartments()
        {
            var departments = await _departmentService.GetAllDepartmentsAsync();
            return Ok(departments);
        }

        // GET: api/department/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<ActionResult<DepartmentDto>> GetDepartmentById(int id)
        {
            var department = await _departmentService.GetDepartmentByIdAsync(id);
            if (department == null)
            {
                return NotFound();
            }
            return Ok(department);
        }

        // POST: api/department
        [HttpPost]
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<ActionResult<DepartmentDto>> CreateDepartment([FromBody] CreateDepartmentDto departmentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Create the department and get the newly created entity with its ID
            var createdDepartmentId = await _departmentService.CreateDepartmentAsync(departmentDto);

            if (createdDepartmentId <= 0)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error creating department");
            }

            // Return the created department, with a 201 Created status and a location header
            return CreatedAtAction(nameof(GetDepartmentById), new { id = createdDepartmentId }, departmentDto);
        }


        // PUT: api/department/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> UpdateDepartment(int id, [FromBody] DepartmentDto departmentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _departmentService.UpdateDepartmentAsync(id, departmentDto);

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

            return Ok(response); // 204 No Content for successful update
        }

        // DELETE: api/department/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            var department = await _departmentService.GetDepartmentByIdAsync(id);
            if (department == null)
            {
                return NotFound();
            }   

            await _departmentService.DeleteDepartmentAsync(id);

            return NoContent(); // 204 No Content
        }

        // POST: api/department/{departmentId}/doctors
        [HttpPost("{departmentId}/doctors")]
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> AddDoctorsToDepartment(int departmentId, [FromBody] IEnumerable<int> doctorIds)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _departmentService.AddDoctorsToDepartmentAsync(departmentId, doctorIds);
                return NoContent(); // 204 No Content
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/department/{departmentId}/doctors
        [HttpDelete("{departmentId}/doctors")]
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> RemoveDoctorsFromDepartment(int departmentId, [FromBody] IEnumerable<int> doctorIds)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _departmentService.RemoveDoctorsFromDepartmentAsync(departmentId, doctorIds);
                return NoContent(); // 204 No Content
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: api/department/{departmentId}/nurses
        [HttpPost("{departmentId}/nurses")]
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> AddNursesToDepartment(int departmentId, [FromBody] IEnumerable<int> nurseIds)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _departmentService.AddNursesToDepartmentAsync(departmentId, nurseIds);
                return NoContent(); // 204 No Content
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/department/{departmentId}/nurses
        [HttpDelete("{departmentId}/nurses")]
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> RemoveNursesFromDepartment(int departmentId, [FromBody] IEnumerable<int> nurseIds)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _departmentService.RemoveNursesFromDepartmentAsync(departmentId, nurseIds);
                return NoContent(); // 204 No Content
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: api/department/{departmentId}/rooms
        [HttpPost("{departmentId}/rooms")]
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> AddRoomsToDepartment(int departmentId, [FromBody] IEnumerable<int> roomIds)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _departmentService.AddRoomsToDepartmentAsync(departmentId, roomIds);
                return NoContent(); // 204 No Content
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/department/{departmentId}/rooms
        [HttpDelete("{departmentId}/rooms")]
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> RemoveRoomsFromDepartment(int departmentId, [FromBody] IEnumerable<int> roomIds)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _departmentService.RemoveRoomsFromDepartmentAsync(departmentId, roomIds);
                return NoContent(); // 204 No Content
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
