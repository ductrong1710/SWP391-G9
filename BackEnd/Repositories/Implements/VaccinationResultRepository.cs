using Businessobjects.Data;
using Businessobjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implements
{
    public class VaccinationResultRepository : IVaccinationResultRepository
    {
        private readonly ApplicationDbContext _context;

        public VaccinationResultRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<VaccinationResult>> GetAllVaccinationResultsAsync()
        {
            return await _context.VaccinationResults
                .Include(r => r.ConsentForm)
                    .ThenInclude(c => c!.Student)
                .Include(r => r.ConsentForm)
                    .ThenInclude(c => c!.Parent)
                .Include(r => r.VaccineType)
                .ToListAsync();
        }

        public async Task<VaccinationResult?> GetVaccinationResultByIdAsync(string id)
        {
            return await _context.VaccinationResults
                .Include(r => r.ConsentForm)
                    .ThenInclude(c => c!.Student)
                .Include(r => r.ConsentForm)
                    .ThenInclude(c => c!.Parent)
                .Include(r => r.VaccineType)
                .FirstOrDefaultAsync(r => r.ID == id);
        }

        public async Task<VaccinationResult?> GetVaccinationResultByConsentFormIdAsync(string consentFormId)
        {
            return await _context.VaccinationResults
                .Include(r => r.ConsentForm)
                    .ThenInclude(c => c!.Student)
                .Include(r => r.ConsentForm)
                    .ThenInclude(c => c!.Parent)
                .Include(r => r.VaccineType)
                .FirstOrDefaultAsync(r => r.ConsentFormID == consentFormId);
        }

        public async Task<IEnumerable<VaccinationResult>> GetVaccinationResultsByVaccineTypeAsync(string vaccineTypeId)
        {
            return await _context.VaccinationResults
                .Include(r => r.ConsentForm)
                    .ThenInclude(c => c!.Student)
                .Include(r => r.ConsentForm)
                    .ThenInclude(c => c!.Parent)
                .Include(r => r.VaccineType)
                .Where(r => r.VaccineTypeID == vaccineTypeId)
                .ToListAsync();
        }

        public async Task<IEnumerable<VaccinationResult>> GetVaccinationResultsByPlanAsync(string planId)
        {
            return await _context.VaccinationResults
                .Include(r => r.ConsentForm)
                    .ThenInclude(c => c!.Student)
                .Include(r => r.ConsentForm)
                    .ThenInclude(c => c!.Parent)
                .Include(r => r.VaccineType)
                .Where(r => r.ConsentForm!.VaccinationPlanID == planId)
                .ToListAsync();
        }

        public async Task CreateVaccinationResultAsync(VaccinationResult result)
        {
            await _context.VaccinationResults.AddAsync(result);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateVaccinationResultAsync(VaccinationResult result)
        {
            _context.Entry(result).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteVaccinationResultAsync(string id)
        {
            var result = await GetVaccinationResultByIdAsync(id);
            if (result != null)
            {
                _context.VaccinationResults.Remove(result);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> VaccinationResultExistsAsync(string id)
        {
            return await _context.VaccinationResults.AnyAsync(r => r.ID == id);
        }

        public async Task<bool> VaccinationResultExistsByConsentFormAsync(string consentFormId)
        {
            return await _context.VaccinationResults.AnyAsync(r => r.ConsentFormID == consentFormId);
        }

        public async Task<VaccinationResult> CreateOrUpdateVaccinationResultAsync(VaccinationResultDto resultDto)
        {
            // Kiểm tra xem đã có kết quả cho consent form này chưa
            var existingResult = await GetVaccinationResultByConsentFormIdAsync(resultDto.ConsentFormID);
            
            if (existingResult != null)
            {
                // Cập nhật kết quả hiện có
                existingResult.VaccineTypeID = resultDto.VaccineTypeID;
                existingResult.ActualVaccinationDate = resultDto.ActualVaccinationDate;
                existingResult.Performer = resultDto.Performer;
                existingResult.PostVaccinationReaction = resultDto.PostVaccinationReaction;
                existingResult.Notes = resultDto.Notes;
                existingResult.NeedToContactParent = resultDto.NeedToContactParent;
                existingResult.VaccinationStatus = resultDto.VaccinationStatus;
                existingResult.PostponementReason = resultDto.PostponementReason;
                existingResult.FailureReason = resultDto.FailureReason;
                existingResult.RefusalReason = resultDto.RefusalReason;
                existingResult.RecordedDate = DateTime.Now;
                existingResult.RecordedBy = resultDto.RecordedBy;

                await UpdateVaccinationResultAsync(existingResult);
                return existingResult;
            }
            else
            {
                // Tạo kết quả mới
                var newResult = new VaccinationResult
                {
                    ID = GenerateVaccinationResultId(),
                    ConsentFormID = resultDto.ConsentFormID,
                    VaccineTypeID = resultDto.VaccineTypeID,
                    ActualVaccinationDate = resultDto.ActualVaccinationDate,
                    Performer = resultDto.Performer,
                    PostVaccinationReaction = resultDto.PostVaccinationReaction,
                    Notes = resultDto.Notes,
                    NeedToContactParent = resultDto.NeedToContactParent,
                    VaccinationStatus = resultDto.VaccinationStatus,
                    PostponementReason = resultDto.PostponementReason,
                    FailureReason = resultDto.FailureReason,
                    RefusalReason = resultDto.RefusalReason,
                    RecordedDate = DateTime.Now,
                    RecordedBy = resultDto.RecordedBy
                };

                await CreateVaccinationResultAsync(newResult);
                return newResult;
            }
        }

        private string GenerateVaccinationResultId()
        {
            // Tạo ID theo format VR + 4 số
            var lastResult = _context.VaccinationResults
                .OrderByDescending(r => r.ID)
                .FirstOrDefault();

            if (lastResult == null)
            {
                return "VR0001";
            }

            var lastNumber = int.Parse(lastResult.ID.Substring(2));
            return $"VR{(lastNumber + 1):D4}";
        }
    }
}