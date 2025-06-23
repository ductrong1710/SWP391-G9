using Businessobjects.Models;

namespace Services.interfaces
{
    public interface IMedicationService
    {
        Task<IEnumerable<Medication>> GetAllMedicationsAsync();
        Task<Medication?> GetMedicationByIdAsync(string id);
        Task<IEnumerable<Medication>> GetExpiredMedicationsAsync();
        Task<IEnumerable<Medication>> GetLowStockMedicationsAsync(int threshold = 10);
        Task<Medication> CreateMedicationAsync(Medication medication);
        Task UpdateMedicationAsync(string id, Medication medication);
        Task DeleteMedicationAsync(string id);
    }
}