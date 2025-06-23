using Microsoft.AspNetCore.Mvc;
using Businessobjects.Models;
using Services.Interfaces;
using System.Threading.Tasks;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            // Log để kiểm tra request
            System.Console.WriteLine($"--- Attempting login for user: {loginRequest.Username} ---");

            var user = await _userService.GetUserByUsernameAsync(loginRequest.Username);
            
            if (user == null)
            {
                System.Console.WriteLine($"DEBUG: User '{loginRequest.Username}' not found.");
                return Unauthorized("Tên đăng nhập hoặc mật khẩu không đúng");
            }

            if (user.Password.Trim() != loginRequest.Password.Trim())
            {
                System.Console.WriteLine($"DEBUG: Password mismatch for user '{loginRequest.Username}'.");
                return Unauthorized("Tên đăng nhập hoặc mật khẩu không đúng");
            }
            
            System.Console.WriteLine($"--- Login successful for user: {loginRequest.Username} ---");

            // Bỏ mật khẩu trước khi trả về cho client
            user.Password = null; 
            return Ok(user);
        }
    }
} 