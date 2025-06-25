using Businessobjects.Models;

namespace Services.Interfaces
{
    public interface IBlogService
    {
        Task<IEnumerable<Blog>> GetAllBlogsAsync();
        Task<Blog?> GetBlogByIdAsync(string id);
        Task<Blog> CreateBlogAsync(Blog blog);
        Task<Blog> UpdateBlogAsync(Blog blog);
        Task<bool> DeleteBlogAsync(string id);
    }
} 