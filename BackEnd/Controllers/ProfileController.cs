using Microsoft.AspNetCore.Mvc;
using Businessobjects.Models;
using Services;
using Services.Interfaces;
using Services.interfaces; // Added namespace for IHealthCheckConsentFormService

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;

        public ProfileController(IProfileService profileService)
        {
            _profileService = profileService;
        }

        // GET: api/Profile
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Profile>>> GetProfiles()
        {
            var profiles = await _profileService.GetAllProfilesAsync();
            return Ok(profiles);
        }

        // GET: api/Profile/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Profile>> GetProfile(Guid id)
        {
            var profile = await _profileService.GetProfileByIdAsync(id);

            if (profile == null)
            {
                return NotFound();
            }

            return profile;
        }

        // GET: api/Profile/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<Profile>> GetProfileByUserId(Guid userId)
        {
            var profile = await _profileService.GetProfileByUserIdAsync(userId);

            if (profile == null)
            {
                return NotFound();
            }

            return profile;
        }

        // POST: api/Profile
        [HttpPost]
        public async Task<ActionResult<Profile>> CreateProfile(Profile profile)
        {
            var createdProfile = await _profileService.CreateProfileAsync(profile);
            return CreatedAtAction(nameof(GetProfile), new { id = createdProfile.ProfileId }, createdProfile);
        }

        // PUT: api/Profile/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProfile(Guid id, Profile profile)
        {
            try
            {
                await _profileService.UpdateProfileAsync(id, profile);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (ArgumentException)
            {
                return BadRequest();
            }

            return NoContent();
        }

        // DELETE: api/Profile/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProfile(Guid id)
        {
            try
            {
                await _profileService.DeleteProfileAsync(id);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}