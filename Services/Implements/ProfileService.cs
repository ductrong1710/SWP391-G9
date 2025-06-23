using Businessobjects.Models;
using Repositories.Interfaces;
using Services.interfaces;
using Services.Interfaces; // Add this using directive

namespace Services.implements
{
    public class ProfileService : IProfileService
    {
        private readonly IProfileRepository _profileRepository;

        public ProfileService(IProfileRepository profileRepository)
        {
            _profileRepository = profileRepository;
        }

        public async Task<IEnumerable<Profile>> GetAllProfilesAsync()
        {
            return await _profileRepository.GetAllProfilesAsync();
        }

        public async Task<Profile?> GetProfileByIdAsync(string id)
        {
            return await _profileRepository.GetProfileByIdAsync(id);
        }

        public async Task<Profile?> GetProfileByUserIdAsync(string userId)
        {
            return await _profileRepository.GetProfileByUserIdAsync(userId);
        }

        public async Task<Profile> CreateProfileAsync(Profile profile)
        {
            await _profileRepository.CreateProfileAsync(profile);
            return profile;
        }

        public async Task UpdateProfileAsync(string id, Profile profile)
        {
            if (id != profile.ProfileID)
                throw new ArgumentException("ID mismatch");

            if (!await _profileRepository.ProfileExistsAsync(id))
                throw new KeyNotFoundException("Profile not found");

            await _profileRepository.UpdateProfileAsync(profile);
        }

        public async Task DeleteProfileAsync(string id)
        {
            if (!await _profileRepository.ProfileExistsAsync(id))
                throw new KeyNotFoundException("Profile not found");

            await _profileRepository.DeleteProfileAsync(id);
        }
    }
}