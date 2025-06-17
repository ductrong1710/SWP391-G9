using Businessobjects.Models;
using Repositories.Interfaces;
using Services.interfaces;
using Services.Interfaces; // Add this using directive

namespace Services.implements
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _userRepository.GetAllUsersAsync();
        }

        public async Task<User?> GetUserByIdAsync(Guid id)
        {
            return await _userRepository.GetUserByIdAsync(id);
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _userRepository.GetUserByUsernameAsync(username);
        }

        public async Task<User> CreateUserAsync(User user)
        {
            await _userRepository.CreateUserAsync(user);
            return user;
        }

        public async Task UpdateUserAsync(Guid id, User user)
        {
            if (id != user.UserId)
                throw new ArgumentException("ID mismatch");

            if (!await _userRepository.UserExistsAsync(id))
                throw new KeyNotFoundException("User not found");

            await _userRepository.UpdateUserAsync(user);
        }

        public async Task DeleteUserAsync(Guid id)
        {
            if (!await _userRepository.UserExistsAsync(id))
                throw new KeyNotFoundException("User not found");

            await _userRepository.DeleteUserAsync(id);
        }
    }
}