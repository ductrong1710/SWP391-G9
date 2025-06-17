using Businessobjects.Models;

namespace Services.interfaces
{
    public interface IMedicalSupplyService
    {
        Task<IEnumerable<MedicalSupply>> GetAllSuppliesAsync();
        Task<MedicalSupply?> GetSupplyByIdAsync(int id);
        Task<MedicalSupply> AddSupplyAsync(MedicalSupply supply);
        Task UpdateSupplyAsync(int id, MedicalSupply supply);
        Task DeleteSupplyAsync(int id);
    }
}