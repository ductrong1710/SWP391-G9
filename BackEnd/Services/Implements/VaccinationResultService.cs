using Businessobjects.Models;
using Repositories.Interfaces;
using Services.Interfaces;

namespace Services.Implements
{
    public class VaccinationResultService : IVaccinationResultService
    {
        private readonly IVaccinationResultRepository _resultRepository;
        private readonly IVaccinationConsentFormRepository _consentFormRepository;
        private readonly IVaccineTypeRepository _vaccineTypeRepository;
        private readonly INotificationService _notificationService;

        public VaccinationResultService(
            IVaccinationResultRepository resultRepository,
            IVaccinationConsentFormRepository consentFormRepository,
            IVaccineTypeRepository vaccineTypeRepository,
            INotificationService notificationService)
        {
            _resultRepository = resultRepository;
            _consentFormRepository = consentFormRepository;
            _vaccineTypeRepository = vaccineTypeRepository;
            _notificationService = notificationService;
        }

        public async Task<IEnumerable<VaccinationResult>> GetAllVaccinationResultsAsync()
        {
            return await _resultRepository.GetAllVaccinationResultsAsync();
        }

        public async Task<VaccinationResult?> GetVaccinationResultByIdAsync(string id)
        {
            return await _resultRepository.GetVaccinationResultByIdAsync(id);
        }

        public async Task<VaccinationResult?> GetVaccinationResultByConsentFormIdAsync(string consentFormId)
        {
            return await _resultRepository.GetVaccinationResultByConsentFormIdAsync(consentFormId);
        }

        public async Task<IEnumerable<VaccinationResult>> GetVaccinationResultsByVaccineTypeAsync(string vaccineTypeId)
        {
            return await _resultRepository.GetVaccinationResultsByVaccineTypeAsync(vaccineTypeId);
        }

        public async Task<IEnumerable<VaccinationResult>> GetVaccinationResultsByPlanAsync(string planId)
        {
            return await _resultRepository.GetVaccinationResultsByPlanAsync(planId);
        }

        public async Task<IEnumerable<VaccinationResult>> GetVaccinationResultsByStudentAsync(string studentId)
        {
            var allResults = await _resultRepository.GetAllVaccinationResultsAsync();
            var filtered = allResults.Where(r => r.ConsentForm != null && r.ConsentForm.StudentID == studentId).ToList();
            return filtered;
        }

        public async Task<IEnumerable<VaccinationResult>> GetVaccinationResultsByStatusAsync(string status)
        {
            var allResults = await _resultRepository.GetAllVaccinationResultsAsync();
            return allResults.Where(r => r.VaccinationStatus == status).ToList();
        }

        public async Task<VaccinationResult> CreateVaccinationResultAsync(VaccinationResult result)
        {
            var consentForm = await _consentFormRepository.GetVaccinationConsentFormByIdAsync(result.ConsentFormID);
            if (consentForm == null)
                throw new KeyNotFoundException("Vaccination consent form not found");

            if (consentForm.ConsentStatus != "Approved")
                throw new InvalidOperationException("Cannot create vaccination result for a non-approved consent form");

            if (await _resultRepository.GetVaccinationResultByConsentFormIdAsync(result.ConsentFormID) != null)
                throw new InvalidOperationException("A vaccination result already exists for this consent form");

            if (!await _vaccineTypeRepository.VaccineTypeExistsAsync(result.VaccineTypeID))
                throw new KeyNotFoundException("Vaccine type not found");

            if (result.ActualVaccinationDate.HasValue && result.ActualVaccinationDate.Value.Date > DateTime.Today)
                throw new InvalidOperationException("Cannot set future date for actual vaccination date");

            if (string.IsNullOrEmpty(result.ID))
            {
                var allResults = await _resultRepository.GetAllVaccinationResultsAsync();
                var last = allResults.OrderByDescending(r => r.ID).FirstOrDefault();
                int nextNum = 1;
                if (last != null && last.ID.Length == 6 && last.ID.StartsWith("VR"))
                {
                    if (int.TryParse(last.ID.Substring(2), out int lastNum))
                    {
                        nextNum = lastNum + 1;
                    }
                }
                result.ID = $"VR{nextNum.ToString("D4")}";
            }

            await _resultRepository.CreateVaccinationResultAsync(result);

            // Gửi notification cho parent
            if (!string.IsNullOrEmpty(consentForm.ParentID))
            {
                var notification = new Notification
                {
                    UserID = consentForm.ParentID,
                    Title = "Kết quả tiêm chủng của con bạn",
                    Message = $"Kết quả tiêm chủng đã được ghi nhận cho học sinh mã {consentForm.StudentID}. Vui lòng kiểm tra chi tiết trong hệ thống.",
                    ConsentFormID = consentForm.ID
                };
                await _notificationService.CreateNotificationAsync(notification);
            }

            return result;
        }

        public async Task UpdateVaccinationResultAsync(string id, VaccinationResult result)
        {
            if (id != result.ID)
                throw new ArgumentException("ID mismatch");

            if (!await _resultRepository.VaccinationResultExistsAsync(id))
                throw new KeyNotFoundException("Vaccination result not found");

            var consentForm = await _consentFormRepository.GetVaccinationConsentFormByIdAsync(result.ConsentFormID);
            if (consentForm == null)
                throw new KeyNotFoundException("Vaccination consent form not found");

            if (!await _vaccineTypeRepository.VaccineTypeExistsAsync(result.VaccineTypeID))
                throw new KeyNotFoundException("Vaccine type not found");

            if (result.ActualVaccinationDate.HasValue && result.ActualVaccinationDate.Value.Date > DateTime.Today)
                throw new InvalidOperationException("Cannot set future date for actual vaccination date");

            await _resultRepository.UpdateVaccinationResultAsync(result);
        }

        public async Task DeleteVaccinationResultAsync(string id)
        {
            if (!await _resultRepository.VaccinationResultExistsAsync(id))
                throw new KeyNotFoundException("Vaccination result not found");

            await _resultRepository.DeleteVaccinationResultAsync(id);
        }

        public async Task<VaccinationResult> RecordVaccinationResultAsync(VaccinationResultDto resultDto)
        {
            // Validate consent form
            var consentForm = await _consentFormRepository.GetVaccinationConsentFormByIdAsync(resultDto.ConsentFormID);
            if (consentForm == null)
                throw new KeyNotFoundException("Vaccination consent form not found");

            if (consentForm.ConsentStatus != "Approved")
                throw new InvalidOperationException("Cannot record vaccination result for a non-approved consent form");

            // Validate vaccine type
            if (!await _vaccineTypeRepository.VaccineTypeExistsAsync(resultDto.VaccineTypeID))
                throw new KeyNotFoundException("Vaccine type not found");

            // Validate vaccination status
            var validStatuses = new[] { "Completed", "Postponed", "Failed", "Refused" };
            if (!validStatuses.Contains(resultDto.VaccinationStatus))
                throw new ArgumentException("Invalid vaccination status");

            // Validate date for completed vaccinations
            if (resultDto.VaccinationStatus == "Completed")
            {
                if (!resultDto.ActualVaccinationDate.HasValue)
                    throw new ArgumentException("Actual vaccination date is required for completed vaccinations");

                if (resultDto.ActualVaccinationDate.Value.Date > DateTime.Today)
                    throw new InvalidOperationException("Cannot set future date for actual vaccination date");
            }

            // Validate reasons based on status
            if (resultDto.VaccinationStatus == "Postponed" && string.IsNullOrEmpty(resultDto.PostponementReason))
                throw new ArgumentException("Postponement reason is required for postponed vaccinations");

            if (resultDto.VaccinationStatus == "Failed" && string.IsNullOrEmpty(resultDto.FailureReason))
                throw new ArgumentException("Failure reason is required for failed vaccinations");

            if (resultDto.VaccinationStatus == "Refused" && string.IsNullOrEmpty(resultDto.RefusalReason))
                throw new ArgumentException("Refusal reason is required for refused vaccinations");

            // Create or update vaccination result
            var result = await _resultRepository.CreateOrUpdateVaccinationResultAsync(resultDto);

            // Send notification to parent
            if (!string.IsNullOrEmpty(consentForm.ParentID))
            {
                string statusMessage = resultDto.VaccinationStatus switch
                {
                    "Completed" => "đã hoàn thành tiêm chủng",
                    "Postponed" => "đã được hoãn tiêm chủng",
                    "Failed" => "tiêm chủng không thành công",
                    "Refused" => "đã từ chối tiêm chủng",
                    _ => "có cập nhật về tiêm chủng"
                };

                var notification = new Notification
                {
                    UserID = consentForm.ParentID,
                    Title = "Cập nhật kết quả tiêm chủng",
                    Message = $"Học sinh mã {consentForm.StudentID} {statusMessage}. Vui lòng kiểm tra chi tiết trong hệ thống.",
                    ConsentFormID = consentForm.ID
                };
                await _notificationService.CreateNotificationAsync(notification);
            }

            return result;
        }
    }
}