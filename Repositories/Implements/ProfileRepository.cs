using Businessobjects.Data;
using Businessobjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implements
{
    public class ProfileRepository : IProfileRepository
    {
        private readonly ApplicationDbContext _context;

        public ProfileRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Profile>> GetAllProfilesAsync()
        {
            return await _context.Profiles.Include(p => p.User).ToListAsync();
        }

        public async Task<Profile?> GetProfileByIdAsync(Guid id)
        {
            return await _context.Profiles
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.ProfileId == id);
        }

        public async Task<Profile?> GetProfileByUserIdAsync(Guid userId)
        {
            return await _context.Profiles
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.UserId == userId);
        }

        public async Task CreateProfileAsync(Profile profile)
        {
            await _context.Profiles.AddAsync(profile);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateProfileAsync(Profile profile)
        {
            _context.Entry(profile).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteProfileAsync(Guid id)
        {
            var profile = await GetProfileByIdAsync(id);
            if (profile != null)
            {
                _context.Profiles.Remove(profile);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ProfileExistsAsync(Guid id)
        {
            return await _context.Profiles.AnyAsync(p => p.ProfileId == id);
        }
    }
}