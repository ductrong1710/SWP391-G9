using Businessobjects.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repositories.Interfaces
{
    public interface IMedicationReceiptRepository : IGenericRepository<MedicationReceipt>
    {
        new Task<IEnumerable<MedicationReceipt>> GetAllAsync();
        new Task<MedicationReceipt?> GetByIdAsync(string id);
        new Task<MedicationReceipt> AddAsync(MedicationReceipt medicationReceipt);
        new Task UpdateAsync(MedicationReceipt medicationReceipt);
        new Task DeleteAsync(string id);
        Task<IEnumerable<MedicationReceipt>> GetByStudentIdAsync(string studentId);
        Task<IEnumerable<MedicationReceipt>> GetByMedicationIdAsync(string medicationId);
        Task<IEnumerable<MedicationReceipt>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
    }
} 