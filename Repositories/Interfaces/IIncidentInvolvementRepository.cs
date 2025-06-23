using Businessobjects.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repositories.Interfaces
{
    public interface IIncidentInvolvementRepository : IGenericRepository<IncidentInvolvement>
    {
        new Task<IEnumerable<IncidentInvolvement>> GetAllAsync();
        new Task<IncidentInvolvement?> GetByIdAsync(string id);
        new Task<IncidentInvolvement> AddAsync(IncidentInvolvement incidentInvolvement);
        new Task UpdateAsync(IncidentInvolvement incidentInvolvement);
        new Task DeleteAsync(string id);
        Task<IEnumerable<IncidentInvolvement>> GetByIncidentIdAsync(string incidentId);
        Task<IEnumerable<IncidentInvolvement>> GetByStudentIdAsync(string studentId);
    }
} 