using Businessobjects.Models;
using Repositories.Interfaces;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Services.Implements
{
    public class MedicationReceiptService : IMedicationReceiptService
    {
        private readonly IMedicationReceiptRepository _receiptRepository;

        public MedicationReceiptService(IMedicationReceiptRepository receiptRepository)
        {
            _receiptRepository = receiptRepository;
        }

        public Task<MedicationReceipt> AddAsync(MedicationReceipt receipt)
        {
            return _receiptRepository.AddAsync(receipt);
        }

        public Task DeleteAsync(string id)
        {
            return _receiptRepository.DeleteAsync(id);
        }

        public Task<IEnumerable<MedicationReceipt>> GetAllAsync()
        {
            return _receiptRepository.GetAllAsync();
        }

        public Task<MedicationReceipt?> GetByIdAsync(string id)
        {
            return _receiptRepository.GetByIdAsync(id);
        }

        public Task<IEnumerable<MedicationReceipt>> GetByStudentIdAsync(string studentId)
        {
            return _receiptRepository.GetByStudentIdAsync(studentId);
        }

        public Task<IEnumerable<MedicationReceipt>> GetByMedicationIdAsync(string medicationId)
        {
            return _receiptRepository.GetByMedicationIdAsync(medicationId);
        }

        public Task<IEnumerable<MedicationReceipt>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return _receiptRepository.GetByDateRangeAsync(startDate, endDate);
        }

        public Task UpdateAsync(MedicationReceipt receipt)
        {
            return _receiptRepository.UpdateAsync(receipt);
        }
    }
} 