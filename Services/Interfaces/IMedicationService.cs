using Businessobjects.Models;

namespace Services.interfaces
{
    public interface IMedicationService
    {
        Task<IEnumerable<Medication>> GetAllMedicationsAsync();
        Task<Medication?> GetMedicationByIdAsync(int id);
        Task<IEnumerable<Medication>> GetExpiredMedicationsAsync();
        Task<IEnumerable<Medication>> GetLowStockMedicationsAsync(int threshold = 10);
        Task<Medication> CreateMedicationAsync(Medication medication);
        Task UpdateMedicationAsync(int id, Medication medication);
        Task DeleteMedicationAsync(int id);
    }
}