using Businessobjects.Models;

namespace Services.interfaces
{
    public interface IVaccineTypeService
    {
        Task<IEnumerable<VaccineType>> GetAllVaccineTypesAsync();
        Task<VaccineType?> GetVaccineTypeByIdAsync(int id);
        Task<VaccineType> CreateVaccineTypeAsync(VaccineType vaccineType);
        Task UpdateVaccineTypeAsync(int id, VaccineType vaccineType);
        Task DeleteVaccineTypeAsync(int id);
    }
}