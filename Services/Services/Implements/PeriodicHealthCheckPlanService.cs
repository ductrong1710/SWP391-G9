using Businessobjects.Models;
using Repositories.Interfaces;
using Services.interfaces;
using Services.Interfaces; // Add this using directive
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Services.implements
{
    public class PeriodicHealthCheckPlanService : IPeriodicHealthCheckPlanService
    {
        private readonly IPeriodicHealthCheckPlanRepository _planRepository;
        private readonly ISchoolClassService _classService;
        private readonly IHealthCheckConsentFormService _consentFormService;
        private readonly IHealthRecordService _healthRecordService;

        public PeriodicHealthCheckPlanService(IPeriodicHealthCheckPlanRepository planRepository, ISchoolClassService classService, IHealthCheckConsentFormService consentFormService, IHealthRecordService healthRecordService)
        {
            _planRepository = planRepository;
            _classService = classService;
            _consentFormService = consentFormService;
            _healthRecordService = healthRecordService;
        }

        public async Task<IEnumerable<PeriodicHealthCheckPlan>> GetAllPlansAsync()
        {
            return await _planRepository.GetAllPlansAsync();
        }

        public async Task<PeriodicHealthCheckPlan?> GetPlanByIdAsync(string id)
        {
            return await _planRepository.GetPlanByIdAsync(id);
        }

        public async Task<IEnumerable<PeriodicHealthCheckPlan>> GetPlansByCreatorIdAsync(string creatorId)
        {
            return await _planRepository.GetPlansByCreatorIdAsync(creatorId);
        }

        public async Task<IEnumerable<PeriodicHealthCheckPlan>> GetUpcomingPlansAsync()
        {
            return await _planRepository.GetUpcomingPlansAsync();
        }

        public async Task<PeriodicHealthCheckPlan> CreatePlanAsync(PeriodicHealthCheckPlan plan)
        {
            await _planRepository.CreatePlanAsync(plan);
            // Nếu cần tạo consent form cho học sinh, hãy truyền danh sách classId từ nơi gọi vào service này (hoặc xử lý ở controller)
            return plan;
        }

        public async Task UpdatePlanAsync(string id, PeriodicHealthCheckPlan plan)
        {
            if (id != plan.ID)
                throw new ArgumentException("ID mismatch");

            if (!await _planRepository.PlanExistsAsync(id))
                throw new KeyNotFoundException("Health check plan not found");

            await _planRepository.UpdatePlanAsync(plan);
        }

        public async Task DeletePlanAsync(string id)
        {
            if (!await _planRepository.PlanExistsAsync(id))
                throw new KeyNotFoundException("Health check plan not found");

            await _planRepository.DeletePlanAsync(id);
        }

        public async Task<IEnumerable<PeriodicHealthCheckPlan>> GetPlansByStatusAsync(string status)
        {
            return await _planRepository.GetPlansByStatusAsync(status);
        }

        public async Task<IEnumerable<PeriodicHealthCheckPlan>> GetPlansByClassIdAsync(string classId)
        {
            return await _planRepository.GetPlansByClassIdAsync(classId);
        }

        public async Task<IEnumerable<PeriodicHealthCheckPlan>> GetPlansByCreatedDateRangeAsync(DateTime start, DateTime end)
        {
            return await _planRepository.GetPlansByCreatedDateRangeAsync(start, end);
        }

        public async Task<IEnumerable<object>> GetAllPlansWithClassNameAsync()
        {
            return await _planRepository.GetAllPlansWithClassNameAsync();
        }
    }
}