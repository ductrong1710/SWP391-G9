using Businessobjects.Models;

namespace Repositories.Interfaces
{
    public interface IMedicalSupplyRepository
    {
        Task<IEnumerable<MedicalSupply>> GetAllSuppliesAsync();
        Task<MedicalSupply?> GetSupplyByIdAsync(int id);
        Task<MedicalSupply> AddSupplyAsync(MedicalSupply supply);
        Task UpdateSupplyAsync(MedicalSupply supply);
        Task DeleteSupplyAsync(int id);
        Task<bool> SupplyExistsAsync(int id);
    }
}