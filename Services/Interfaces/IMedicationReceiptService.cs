using Businessobjects.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IMedicationReceiptService
    {
        Task<IEnumerable<MedicationReceipt>> GetAllAsync();
        Task<MedicationReceipt?> GetByIdAsync(string id);
        Task<MedicationReceipt> AddAsync(MedicationReceipt receipt);
        Task UpdateAsync(MedicationReceipt receipt);
        Task DeleteAsync(string id);
        Task<IEnumerable<MedicationReceipt>> GetByStudentIdAsync(string studentId);
        Task<IEnumerable<MedicationReceipt>> GetByMedicationIdAsync(string medicationId);
        Task<IEnumerable<MedicationReceipt>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
    }
} 