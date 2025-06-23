using Businessobjects.Models;
using Repositories.Interfaces;
using Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Services.Implements
{
    public class IncidentInvolvementService : IIncidentInvolvementService
    {
        private readonly IIncidentInvolvementRepository _involvementRepository;

        public IncidentInvolvementService(IIncidentInvolvementRepository involvementRepository)
        {
            _involvementRepository = involvementRepository;
        }

        public Task<IncidentInvolvement> AddAsync(IncidentInvolvement involvement)
        {
            return _involvementRepository.AddAsync(involvement);
        }

        public Task DeleteAsync(string id)
        {
            return _involvementRepository.DeleteAsync(id);
        }

        public Task<IEnumerable<IncidentInvolvement>> GetAllAsync()
        {
            return _involvementRepository.GetAllAsync();
        }

        public Task<IncidentInvolvement?> GetByIdAsync(string id)
        {
            return _involvementRepository.GetByIdAsync(id);
        }

        public Task<IEnumerable<IncidentInvolvement>> GetByIncidentIdAsync(string incidentId)
        {
            return _involvementRepository.GetByIncidentIdAsync(incidentId);
        }

        public Task<IEnumerable<IncidentInvolvement>> GetByStudentIdAsync(string studentId)
        {
            return _involvementRepository.GetByStudentIdAsync(studentId);
        }

        public Task UpdateAsync(IncidentInvolvement involvement)
        {
            return _involvementRepository.UpdateAsync(involvement);
        }
    }
} 