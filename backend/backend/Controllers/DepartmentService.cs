using backend.Core.Constants;
using backend.Core.Dtos.General;
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
        public async Task<ActionResult<DepartmentDto>> CreateDepartment([FromBody] DepartmentDto departmentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _departmentService.CreateDepartmentAsync(departmentDto);

            // Return the created department, with a 201 Created status and a location header
            return CreatedAtAction(nameof(GetDepartmentById), new { id = departmentDto.Id }, departmentDto);
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

            var department = await _departmentService.GetDepartmentByIdAsync(id);
            if (department == null)
            {
                return NotFound();
            }

            await _departmentService.UpdateDepartmentAsync(id, departmentDto);

            return NoContent(); // 204 No Content
        }

        // DELETE: api/department/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles =StaticUserRoles.ADMIN)]
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
    }
}
