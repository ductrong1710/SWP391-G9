using Businessobjects.Models;

namespace Repositories.Interfaces
{
    public interface IProfileRepository
    {
        Task<IEnumerable<Profile>> GetAllProfilesAsync();
        Task<Profile?> GetProfileByIdAsync(Guid id);
        Task<Profile?> GetProfileByUserIdAsync(Guid userId);
        Task CreateProfileAsync(Profile profile);
        Task UpdateProfileAsync(Profile profile);
        Task DeleteProfileAsync(Guid id);
        Task<bool> ProfileExistsAsync(Guid id);
    }
}