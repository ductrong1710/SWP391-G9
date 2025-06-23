using Businessobjects.Models;
using Repositories.Interfaces;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Services.Implements
{
    public class MedicalIncidentService : IMedicalIncidentService
    {
        private readonly IMedicalIncidentRepository _incidentRepository;

        public MedicalIncidentService(IMedicalIncidentRepository incidentRepository)
        {
            _incidentRepository = incidentRepository;
        }

        public Task<MedicalIncident> AddAsync(MedicalIncident incident)
        {
            return _incidentRepository.AddAsync(incident);
        }

        public Task DeleteAsync(string id)
        {
            return _incidentRepository.DeleteAsync(id);
        }

        public Task<IEnumerable<MedicalIncident>> GetAllAsync()
        {
            return _incidentRepository.GetAllAsync();
        }

        public Task<MedicalIncident?> GetByIdAsync(string id)
        {
            return _incidentRepository.GetByIdAsync(id);
        }

        public Task<IEnumerable<MedicalIncident>> GetByReporterIdAsync(string reporterId)
        {
            return _incidentRepository.GetByReporterIdAsync(reporterId);
        }

        public Task<IEnumerable<MedicalIncident>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return _incidentRepository.GetByDateRangeAsync(startDate, endDate);
        }

        public Task UpdateAsync(MedicalIncident incident)
        {
            return _incidentRepository.UpdateAsync(incident);
        }
    }
} 