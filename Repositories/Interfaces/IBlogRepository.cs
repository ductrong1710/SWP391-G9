using Businessobjects.Models;

namespace Repositories.Interfaces
{
    public interface IBlogRepository
    {
        Task<IEnumerable<Blog>> GetAllAsync();
        Task<Blog?> GetByIdAsync(string id);
        Task<Blog> AddAsync(Blog blog);
        Task<Blog> UpdateAsync(Blog blog);
        Task<bool> DeleteAsync(string id);
    }
} 