using Businessobjects.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace Repositories.Interfaces
{
    public interface ISupplyMedUsageRepository : IGenericRepository<SupplyMedUsage>
    {
        new Task<IEnumerable<SupplyMedUsage>> GetAllAsync();
        new Task<SupplyMedUsage?> GetByIdAsync(string id);
        new Task<SupplyMedUsage> AddAsync(SupplyMedUsage supplyMedUsage);
        new Task UpdateAsync(SupplyMedUsage supplyMedUsage);
        new Task DeleteAsync(string id);
        Task<IEnumerable<SupplyMedUsage>> GetBySupplyIdAsync(string supplyId);
        Task<IEnumerable<SupplyMedUsage>> GetByStudentIdAsync(string studentId);
        Task<IEnumerable<SupplyMedUsage>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
    }
} 