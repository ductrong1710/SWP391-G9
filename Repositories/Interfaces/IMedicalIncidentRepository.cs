using Businessobjects.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repositories.Interfaces
{
    public interface IMedicalIncidentRepository : IGenericRepository<MedicalIncident>
    {
        new Task<IEnumerable<MedicalIncident>> GetAllAsync();
        new Task<MedicalIncident?> GetByIdAsync(string id);
        new Task<MedicalIncident> AddAsync(MedicalIncident medicalIncident);
        new Task UpdateAsync(MedicalIncident medicalIncident);
        new Task DeleteAsync(string id);
        Task<IEnumerable<MedicalIncident>> GetByReporterIdAsync(string reporterId);
        Task<IEnumerable<MedicalIncident>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
    }
} 