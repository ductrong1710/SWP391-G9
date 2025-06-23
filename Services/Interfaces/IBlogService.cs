using Businessobjects.Models;

namespace Services.Interfaces
{
    public interface IBlogService
    {
        Task<IEnumerable<Blog>> GetAllAsync();
        Task<Blog?> GetByIdAsync(string id);
        Task<Blog> AddAsync(Blog blog);
        Task UpdateAsync(Blog blog);
        Task DeleteAsync(string id);
        Task<IEnumerable<Blog>> GetByAuthorIdAsync(string authorId);
        Task<IEnumerable<Blog>> GetByCategoryAsync(string category);
        Task<IEnumerable<Blog>> GetByStatusAsync(string status);
    }
} 