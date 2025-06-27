using Microsoft.AspNetCore.Mvc;
using Businessobjects.Models;
using Services.Interfaces;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Notification>>> GetNotificationsByUserId(string userId)
        {
            var notifications = await _notificationService.GetNotificationsByUserIdAsync(userId);
            return Ok(notifications);
        }

        [HttpPost]
        public async Task<ActionResult> CreateNotification([FromBody] Notification notification)
        {
            await _notificationService.CreateNotificationAsync(notification);
            return Ok();
        }

        [HttpPost("mark-as-read/{notificationId}")]
        public async Task<ActionResult> MarkAsRead(string notificationId)
        {
            await _notificationService.MarkAsReadAsync(notificationId);
            return Ok();
        }
    }
} 