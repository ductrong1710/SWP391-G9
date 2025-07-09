using Businessobjects.Models;

namespace Services.Interfaces
{
    public interface IMedicalIncidentService
    {
        Task<IEnumerable<MedicalIncident>> GetAllMedicalIncidentsAsync();
        Task<MedicalIncident?> GetMedicalIncidentByIdAsync(string id);
        Task<IEnumerable<MedicalIncident>> GetMedicalIncidentsByMedicalStaffIdAsync(string medicalStaffId);
        Task<MedicalIncident> CreateMedicalIncidentAsync(MedicalIncident medicalIncident);
        Task<MedicalIncident> UpdateMedicalIncidentAsync(MedicalIncident medicalIncident);
        Task<bool> DeleteMedicalIncidentAsync(string id);
    }
} 