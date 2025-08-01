using Businessobjects.Data;
using Businessobjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implements
{
    public class VaccineTypeRepository : IVaccineTypeRepository
    {
        private readonly ApplicationDbContext _context;

        public VaccineTypeRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<VaccineType>> GetAllVaccineTypesAsync()
        {
            return await _context.VaccinationTypes
                .Include(v => v.VaccinationResults)
                .Include(v => v.VaccineDiseases)
                .ToListAsync();
        }

        public async Task<VaccineType?> GetVaccineTypeByIdAsync(string id)
        {
            return await _context.VaccinationTypes
                .Include(v => v.VaccinationResults)
                .Include(v => v.VaccineDiseases)
                .FirstOrDefaultAsync(v => v.VaccinationID == id);
        }

        public async Task CreateVaccineTypeAsync(VaccineType vaccineType)
        {
            await _context.VaccinationTypes.AddAsync(vaccineType);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateVaccineTypeAsync(VaccineType vaccineType)
        {
            Console.WriteLine($"Repository: Updating vaccine {vaccineType.VaccinationID}");
            
            // Lấy entity hiện tại từ database
            var existingVaccine = await _context.VaccinationTypes
                .FirstOrDefaultAsync(v => v.VaccinationID == vaccineType.VaccinationID);
            
            if (existingVaccine != null)
            {
                // Update properties của entity hiện tại
                existingVaccine.VaccineName = vaccineType.VaccineName;
                existingVaccine.Description = vaccineType.Description;
                
                Console.WriteLine($"Repository: Updated existing entity properties");
                await _context.SaveChangesAsync();
                Console.WriteLine($"Repository: SaveChanges completed successfully");
            }
            else
            {
                Console.WriteLine($"Repository: Vaccine not found in database");
                throw new KeyNotFoundException($"Vaccine with ID {vaccineType.VaccinationID} not found");
            }
        }

        public async Task DeleteVaccineTypeAsync(string id)
        {
            var vaccineType = await GetVaccineTypeByIdAsync(id);
            if (vaccineType != null)
            {
                _context.VaccinationTypes.Remove(vaccineType);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> VaccineTypeExistsAsync(string id)
        {
            return await _context.VaccinationTypes.AnyAsync(v => v.VaccinationID == id);
        }

        public async Task<bool> VaccineTypeExistsByNameAsync(string name)
        {
            return await _context.VaccinationTypes.AnyAsync(v => v.VaccineName.ToLower() == name.ToLower());
        }
    }
}