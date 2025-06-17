using Businessobjects.Models;

namespace Services.interfaces
{
    public interface IRoleService
    {
        Task<IEnumerable<Role>> GetAllRolesAsync();
        Task<Role?> GetRoleByIdAsync(int id);
        Task<Role?> GetRoleByTypeAsync(string roleType);
        Task<Role> CreateRoleAsync(Role role);
        Task UpdateRoleAsync(int id, Role role);
        Task DeleteRoleAsync(int id);
    }
}