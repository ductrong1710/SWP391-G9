using Businessobjects.Models;
using Repositories.Interfaces;

namespace Repositories.Interfaces
{
    public interface IBlogRepository : IGenericRepository<Blog>
    {
        Task<IEnumerable<Blog>> GetByAuthorIdAsync(string authorId);
        Task<IEnumerable<Blog>> GetByCategoryAsync(string category);
        Task<IEnumerable<Blog>> GetByStatusAsync(string status);
    }
} 