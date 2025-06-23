using Businessobjects.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IMedicalIncidentService
    {
        Task<IEnumerable<MedicalIncident>> GetAllAsync();
        Task<MedicalIncident?> GetByIdAsync(string id);
        Task<MedicalIncident> AddAsync(MedicalIncident incident);
        Task UpdateAsync(MedicalIncident incident);
        Task DeleteAsync(string id);
        Task<IEnumerable<MedicalIncident>> GetByReporterIdAsync(string reporterId);
        Task<IEnumerable<MedicalIncident>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
    }
} 