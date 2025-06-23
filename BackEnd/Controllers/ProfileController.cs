using Microsoft.AspNetCore.Mvc;
using Businessobjects.Models;
using Services;
using Services.Interfaces;

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
        public async Task<ActionResult<Profile>> GetProfile(string id)
        {
            var profile = await _profileService.GetProfileByIdAsync(id);

            if (profile == null)
            {
                return NotFound();
            }

            return profile;
        }

        // GET: api/Profile/user/5
        [HttpGet("user/{userID}")]
        public async Task<ActionResult<Profile>> GetProfileByUserId(string userID)
        {
            var profile = await _profileService.GetProfileByUserIdAsync(userID);

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
            return CreatedAtAction(nameof(GetProfile), new { id = createdProfile.ProfileID }, createdProfile);
        }

        // PUT: api/Profile/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProfile(string id, Profile profile)
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
        public async Task<IActionResult> DeleteProfile(string id)
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