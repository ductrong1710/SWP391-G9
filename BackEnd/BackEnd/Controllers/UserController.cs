using Microsoft.AspNetCore.Mvc;
using Businessobjects.Models;
using Services;
using Services.Interfaces;
using BackEnd.Attributes;
using BackEnd.Helpers;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [JwtAuthorize] // Yêu cầu authentication cho tất cả endpoints
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/User
        [HttpGet]
        [JwtAuthorize("Admin", "MedicalStaff")] // Chỉ Admin và MedicalStaff mới xem được danh sách user
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        // GET: api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(string id)
        {
            // Kiểm tra quyền: chỉ Admin, MedicalStaff hoặc chính user đó mới xem được
            var currentUserID = HttpContext.GetCurrentUserID();
            var currentUserRole = HttpContext.GetCurrentUserRole();
            
            if (!HttpContext.HasRole("Admin", "MedicalStaff") && currentUserID != id)
            {
                return Forbid();
            }

            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
                return NotFound();

            return Ok(user);
        }

        // POST: api/User
        [HttpPost]
        [JwtAuthorize("Admin")] // Chỉ Admin mới tạo được user mới
        public async Task<ActionResult<User>> CreateUser(User user)
        {
            var createdUser = await _userService.CreateUserAsync(user);
            return CreatedAtAction(nameof(GetUser), new { id = createdUser.UserID }, createdUser);
        }

        // PUT: api/User/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, User user)
        {
            if (id != user.UserID)
                return BadRequest();

            // Kiểm tra quyền: chỉ Admin, MedicalStaff hoặc chính user đó mới sửa được
            var currentUserID = HttpContext.GetCurrentUserID();
            
            if (!HttpContext.HasRole("Admin", "MedicalStaff") && currentUserID != id)
            {
                return Forbid();
            }

            await _userService.UpdateUserAsync(id, user);
            return NoContent();
        }

        // DELETE: api/User/5
        [HttpDelete("{id}")]
        [JwtAuthorize("Admin")] // Chỉ Admin mới xóa được user
        public async Task<IActionResult> DeleteUser(string id)
        {
            await _userService.DeleteUserAsync(id);
            return NoContent();
        }

        // GET: api/User/parent/{parentId}/children
        [HttpGet("parent/{parentId}/children")]
        public async Task<ActionResult<IEnumerable<User>>> GetChildrenByParent(string parentId)
        {
            // Kiểm tra quyền: chỉ Admin, MedicalStaff hoặc chính parent đó mới xem được
            var currentUserID = HttpContext.GetCurrentUserID();
            
            if (!HttpContext.HasRole("Admin", "MedicalStaff") && currentUserID != parentId)
            {
                return Forbid();
            }

            var children = await _userService.GetChildrenByParentIdAsync(parentId);
            if (children == null || !children.Any())
                return NotFound();
            return Ok(children);
        }
    }
}