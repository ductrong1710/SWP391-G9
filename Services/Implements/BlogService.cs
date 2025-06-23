using Businessobjects.Models;
using Repositories.Interfaces;
using Services.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace Services.Implements
{
    public class BlogService : IBlogService
    {
        private readonly IBlogRepository _repository;

        public BlogService(IBlogRepository repository)
        {
            _repository = repository;
        }

        public async Task<Blog> AddAsync(Blog blog)
        {
            blog.Id = GenerateId();
            blog.CreatedAt = DateTime.Now;
            blog.UpdatedAt = DateTime.Now;
            
            if(string.IsNullOrEmpty(blog.Status))
            {
                blog.Status = "Draft"; // Default status
            }

            return await _repository.AddAsync(blog);
        }

        public async Task DeleteAsync(string id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task<IEnumerable<Blog>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<IEnumerable<Blog>> GetByAuthorIdAsync(string authorId)
        {
            return await _repository.GetByAuthorIdAsync(authorId);
        }

        public async Task<IEnumerable<Blog>> GetByCategoryAsync(string category)
        {
            return await _repository.GetByCategoryAsync(category);
        }
        
        public async Task<IEnumerable<Blog>> GetByStatusAsync(string status)
        {
            return await _repository.GetByStatusAsync(status);
        }

        public async Task<Blog?> GetByIdAsync(string id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task UpdateAsync(Blog blog)
        {
            blog.UpdatedAt = DateTime.Now;
            await _repository.UpdateAsync(blog);
        }

        private string GenerateId()
        {
            using (var sha256 = SHA256.Create())
            {
                var hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(Guid.NewGuid().ToString()));
                return Convert.ToHexString(hash).Substring(0, 6).ToUpper();
            }
        }
    }
} 