using Businessobjects.Models;
using Repositories.Interfaces;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Services.Implements
{
    public class SupplyMedUsageService : ISupplyMedUsageService
    {
        private readonly ISupplyMedUsageRepository _usageRepository;

        public SupplyMedUsageService(ISupplyMedUsageRepository usageRepository)
        {
            _usageRepository = usageRepository;
        }

        public Task<SupplyMedUsage> AddAsync(SupplyMedUsage usage)
        {
            return _usageRepository.AddAsync(usage);
        }

        public Task DeleteAsync(string id)
        {
            return _usageRepository.DeleteAsync(id);
        }

        public Task<IEnumerable<SupplyMedUsage>> GetAllAsync()
        {
            return _usageRepository.GetAllAsync();
        }

        public Task<SupplyMedUsage?> GetByIdAsync(string id)
        {
            return _usageRepository.GetByIdAsync(id);
        }

        public Task<IEnumerable<SupplyMedUsage>> GetBySupplyIdAsync(string supplyId)
        {
            return _usageRepository.GetBySupplyIdAsync(supplyId);
        }

        public Task<IEnumerable<SupplyMedUsage>> GetByStudentIdAsync(string studentId)
        {
            return _usageRepository.GetByStudentIdAsync(studentId);
        }

        public Task<IEnumerable<SupplyMedUsage>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return _usageRepository.GetByDateRangeAsync(startDate, endDate);
        }

        public Task UpdateAsync(SupplyMedUsage usage)
        {
            return _usageRepository.UpdateAsync(usage);
        }
    }
} 