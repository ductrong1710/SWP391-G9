using Businessobjects.Models;

namespace Services.interfaces
{
    public interface IProfileService
    {
        Task<IEnumerable<Profile>> GetAllProfilesAsync();
        Task<Profile?> GetProfileByIdAsync(Guid id);
        Task<Profile?> GetProfileByUserIdAsync(Guid userId);
        Task<Profile> CreateProfileAsync(Profile profile);
        Task UpdateProfileAsync(Guid id, Profile profile);
        Task DeleteProfileAsync(Guid id);
    }
}