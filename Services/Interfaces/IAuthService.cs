using Businessobjects.Models;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IAuthService
    {
        Task<string> GenerateJwtTokenAsync(User user);
        Task<User?> AuthenticateUserAsync(string username, string password);
        Task<User?> GetUserFromTokenAsync(string token);
    }
} 