using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Businessobjects.Models;
using Services.Interfaces;
using System.Security.Claims;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogController : ControllerBase
    {
        private readonly IBlogService _blogService;

        public BlogController(IBlogService blogService)
        {
            _blogService = blogService;
        }

        // GET: api/Blog - Get all published blogs (for all users)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Blog>>> GetAllBlogs()
        {
            var blogs = await _blogService.GetByStatusAsync("Published");
            return Ok(blogs);
        }

        // GET: api/Blog/all - Get all blogs (for admin and medical staff)
        [HttpGet("all")]
        [Authorize(Roles = "Admin,MedicalStaff")]
        public async Task<ActionResult<IEnumerable<Blog>>> GetAllBlogsForAdmin()
        {
            var blogs = await _blogService.GetAllAsync();
            return Ok(blogs);
        }

        // GET: api/Blog/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Blog>> GetBlog(string id)
        {
            var blog = await _blogService.GetByIdAsync(id);
            if (blog == null)
            {
                return NotFound("Không tìm thấy bài viết");
            }

            // Allow access if published, or if user is the author or admin/medicalstaff
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (blog.Status == "Published" ||
                userRole == "Admin" ||
                userRole == "MedicalStaff" ||
                blog.AuthorId == userId)
            {
                return Ok(blog);
            }
            
            return Forbid("Bạn không có quyền xem bài viết này");
        }

        // POST: api/Blog - Medical staff can create blogs
        [HttpPost]
        [Authorize(Roles = "MedicalStaff")]
        public async Task<ActionResult<Blog>> CreateBlog(Blog blog)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("Người dùng chưa đăng nhập");
                }

                blog.AuthorId = userId;
                var createdBlog = await _blogService.AddAsync(blog);
                return CreatedAtAction(nameof(GetBlog), new { id = createdBlog.Id }, createdBlog);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        // PUT: api/Blog/5 - Medical staff can update their own blogs
        [HttpPut("{id}")]
        [Authorize(Roles = "MedicalStaff")]
        public async Task<IActionResult> UpdateBlog(string id, Blog blog)
        {
            try
            {
                var existingBlog = await _blogService.GetByIdAsync(id);
                if (existingBlog == null)
                {
                    return NotFound("Không tìm thấy bài viết");
                }

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (existingBlog.AuthorId != userId)
                {
                    return Forbid("Bạn chỉ có thể cập nhật bài viết của mình");
                }

                blog.Id = id;
                await _blogService.UpdateAsync(blog);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        // DELETE: api/Blog/5 - Admin or author can delete blogs
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,MedicalStaff")]
        public async Task<IActionResult> DeleteBlog(string id)
        {
            try
            {
                var existingBlog = await _blogService.GetByIdAsync(id);
                if (existingBlog == null)
                {
                    return NotFound("Không tìm thấy bài viết");
                }

                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (userRole != "Admin" && existingBlog.AuthorId != userId)
                {
                    return Forbid("Bạn không có quyền xóa bài viết này");
                }

                await _blogService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }
    }
} 