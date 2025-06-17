using Businessobjects.Models;

namespace Repositories.Interfaces
{
    public interface IVaccineTypeRepository
    {
        Task<IEnumerable<VaccineType>> GetAllVaccineTypesAsync();
        Task<VaccineType?> GetVaccineTypeByIdAsync(int id);
        Task CreateVaccineTypeAsync(VaccineType vaccineType);
        Task UpdateVaccineTypeAsync(VaccineType vaccineType);
        Task DeleteVaccineTypeAsync(int id);
        Task<bool> VaccineTypeExistsAsync(int id);
        Task<bool> VaccineTypeExistsByNameAsync(string name);
    }
}