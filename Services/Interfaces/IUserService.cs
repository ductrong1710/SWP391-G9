using Businessobjects.Models;
namespace Services.interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User?> GetUserByIdAsync(string id);
        Task<User?> GetUserByUsernameAsync(string username);
        Task<User> CreateUserAsync(User user);
        Task UpdateUserAsync(string id, User user);
        Task DeleteUserAsync(string id);
    }
}