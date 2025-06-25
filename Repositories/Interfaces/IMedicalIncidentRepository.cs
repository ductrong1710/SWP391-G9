using Businessobjects.Models;

namespace Repositories.Interfaces
{
    public interface IMedicalIncidentRepository
    {
        Task<IEnumerable<MedicalIncident>> GetAllAsync();
        Task<MedicalIncident?> GetByIdAsync(string id);
        Task<IEnumerable<MedicalIncident>> GetByMedicalStaffIdAsync(string medicalStaffId);
        Task<MedicalIncident> AddAsync(MedicalIncident medicalIncident);
        Task<MedicalIncident> UpdateAsync(MedicalIncident medicalIncident);
        Task<bool> DeleteAsync(string id);
    }
} 