using Businessobjects.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface ISupplyMedUsageService
    {
        Task<IEnumerable<SupplyMedUsage>> GetAllAsync();
        Task<SupplyMedUsage?> GetByIdAsync(string id);
        Task<SupplyMedUsage> AddAsync(SupplyMedUsage usage);
        Task UpdateAsync(SupplyMedUsage usage);
        Task DeleteAsync(string id);
        Task<IEnumerable<SupplyMedUsage>> GetBySupplyIdAsync(string supplyId);
        Task<IEnumerable<SupplyMedUsage>> GetByStudentIdAsync(string studentId);
        Task<IEnumerable<SupplyMedUsage>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
    }
} 