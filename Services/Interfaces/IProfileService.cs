using Businessobjects.Models;

namespace Services.Interfaces
{
    public interface IProfileService
    {
        Task<IEnumerable<Profile>> GetAllProfilesAsync();
        Task<Profile?> GetProfileByIdAsync(string id);
        Task<Profile?> GetProfileByUserIdAsync(string userID);
        Task<Profile> CreateProfileAsync(Profile profile);
        Task UpdateProfileAsync(string id, Profile profile);
        Task DeleteProfileAsync(string id);
    }
}