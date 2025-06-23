using Businessobjects.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IIncidentInvolvementService
    {
        Task<IEnumerable<IncidentInvolvement>> GetAllAsync();
        Task<IncidentInvolvement?> GetByIdAsync(string id);
        Task<IncidentInvolvement> AddAsync(IncidentInvolvement involvement);
        Task UpdateAsync(IncidentInvolvement involvement);
        Task DeleteAsync(string id);
        Task<IEnumerable<IncidentInvolvement>> GetByIncidentIdAsync(string incidentId);
        Task<IEnumerable<IncidentInvolvement>> GetByStudentIdAsync(string studentId);
    }
} 