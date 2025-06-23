using Businessobjects.Data;
using Businessobjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implements
{
    public class BlogRepository : GenericRepository<Blog>, IBlogRepository
    {
        public BlogRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Blog>> GetByAuthorIdAsync(string authorId)
        {
            return await _dbSet.Where(b => b.AuthorId == authorId).ToListAsync();
        }

        public async Task<IEnumerable<Blog>> GetByCategoryAsync(string category)
        {
            return await _dbSet.Where(b => b.Category == category).ToListAsync();
        }

        public async Task<IEnumerable<Blog>> GetByStatusAsync(string status)
        {
            return await _dbSet.Where(b => b.Status == status).ToListAsync();
        }

        public override async Task<IEnumerable<Blog>> GetAllAsync()
        {
            return await _dbSet.Include(b => b.Author).ToListAsync();
        }

        public override async Task<Blog?> GetByIdAsync(string id)
        {
            return await _dbSet.Include(b => b.Author).FirstOrDefaultAsync(b => b.Id == id);
        }
    }
} 