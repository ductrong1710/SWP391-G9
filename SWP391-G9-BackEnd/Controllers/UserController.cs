using Microsoft.AspNetCore.Mvc;
using newbacken.Models;
using System.Collections.Generic;

namespace newbacken.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        // Tạm thời dùng list giả lập, thực tế sẽ dùng database
        private static List<User> users = new List<User>();

        [HttpGet]
        public ActionResult<IEnumerable<User>> GetAll()
        {
            return Ok(users);
        }

        [HttpGet("{id}")]
        public ActionResult<User> GetById(int id)
        {
            var user = users.Find(u => u.UserId == id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPost]
        public ActionResult<User> Create(User user)
        {
            user.UserId = users.Count + 1;
            users.Add(user);
            return CreatedAtAction(nameof(GetById), new { id = user.UserId }, user);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, User user)
        {
            var existing = users.Find(u => u.UserId == id);
            if (existing == null) return NotFound();
            // Update fields
            existing.Username = user.Username;
            existing.Password = user.Password;
            existing.FirstName = user.FirstName;
            existing.LastName = user.LastName;
            existing.Email = user.Email;
            existing.Phone = user.Phone;
            existing.UserType = user.UserType;
            existing.IsActive = user.IsActive;
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var user = users.Find(u => u.UserId == id);
            if (user == null) return NotFound();
            users.Remove(user);
            return NoContent();
        }
    }
}
