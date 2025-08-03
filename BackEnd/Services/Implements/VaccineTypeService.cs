using Businessobjects.Models;
using Repositories.Interfaces;
using Services.Interfaces; // Add this using directive

namespace Services.Implements
{
    public class VaccineTypeService : IVaccineTypeService
    {
        private readonly IVaccineTypeRepository _vaccineTypeRepository;

        public VaccineTypeService(IVaccineTypeRepository vaccineTypeRepository)
        {
            _vaccineTypeRepository = vaccineTypeRepository;
        }

        public async Task<IEnumerable<VaccineType>> GetAllVaccineTypesAsync()
        {
            return await _vaccineTypeRepository.GetAllVaccineTypesAsync();
        }

        public async Task<VaccineType?> GetVaccineTypeByIdAsync(string id)
        {
            return await _vaccineTypeRepository.GetVaccineTypeByIdAsync(id);
        }

        public async Task<VaccineType> CreateVaccineTypeAsync(VaccineType vaccineType)
        {
            if (await _vaccineTypeRepository.VaccineTypeExistsByNameAsync(vaccineType.VaccineName))
                throw new InvalidOperationException("A vaccine type with this name already exists");

            // Sinh mã tự động nếu chưa có
            if (string.IsNullOrWhiteSpace(vaccineType.VaccinationID))
            {
                // Lấy mã lớn nhất hiện có
                var all = await _vaccineTypeRepository.GetAllVaccineTypesAsync();
                int max = 0;
                foreach (var v in all)
                {
                    if (v.VaccinationID != null && v.VaccinationID.StartsWith("VC"))
                    {
                        var numPart = v.VaccinationID.Substring(2);
                        if (int.TryParse(numPart, out int n) && n > max)
                            max = n;
                    }
                }
                vaccineType.VaccinationID = $"VC{(max + 1).ToString("D4")}";
            }

            await _vaccineTypeRepository.CreateVaccineTypeAsync(vaccineType);
            return vaccineType;
        }

        public async Task UpdateVaccineTypeAsync(string id, VaccineType vaccineType)
        {
            Console.WriteLine($"UpdateVaccineTypeAsync called with id: {id}, vaccineType.VaccinationID: {vaccineType.VaccinationID}");
            
            if (id != vaccineType.VaccinationID)
                throw new ArgumentException("ID mismatch");

            if (!await _vaccineTypeRepository.VaccineTypeExistsAsync(id))
                throw new KeyNotFoundException("Vaccine type not found");

            var existingVaccineType = await _vaccineTypeRepository.GetVaccineTypeByIdAsync(id);
            Console.WriteLine($"Existing vaccine: {existingVaccineType?.VaccineName}, New vaccine: {vaccineType.VaccineName}");
            
            bool nameChanged = existingVaccineType?.VaccineName != vaccineType.VaccineName;
            Console.WriteLine($"Name changed: {nameChanged}");
            
            if (nameChanged)
            {
                bool nameExists = await _vaccineTypeRepository.VaccineTypeExistsByNameAsync(vaccineType.VaccineName);
                Console.WriteLine($"Name exists check: {nameExists}");
                
                if (nameExists)
                {
                    Console.WriteLine($"Vaccine name conflict detected: {vaccineType.VaccineName}");
                    throw new InvalidOperationException("A vaccine type with this name already exists");
                }
            }

            Console.WriteLine($"Updating vaccine {id} with new data: {vaccineType.VaccineName} - {vaccineType.Description}");
            await _vaccineTypeRepository.UpdateVaccineTypeAsync(vaccineType);
            Console.WriteLine($"Vaccine {id} updated successfully");
        }

        public async Task DeleteVaccineTypeAsync(string id)
        {
            if (!await _vaccineTypeRepository.VaccineTypeExistsAsync(id))
                throw new KeyNotFoundException("Vaccine type not found");

            await _vaccineTypeRepository.DeleteVaccineTypeAsync(id);
        }

        public async Task AddDiseaseToVaccineAsync(string vaccineId, VaccineDisease disease)
        {
            if (!await _vaccineTypeRepository.VaccineTypeExistsAsync(vaccineId))
                throw new KeyNotFoundException("Vaccine type not found");

            // Sinh mã tự động cho disease
            if (string.IsNullOrWhiteSpace(disease.VaccineDiseaseID))
            {
                var allDiseases = await _vaccineTypeRepository.GetAllVaccineDiseasesAsync();
                int max = 0;
                foreach (var d in allDiseases)
                {
                    if (d.VaccineDiseaseID != null && d.VaccineDiseaseID.StartsWith("VD"))
                    {
                        var numPart = d.VaccineDiseaseID.Substring(2);
                        if (int.TryParse(numPart, out int n) && n > max)
                            max = n;
                    }
                }
                disease.VaccineDiseaseID = $"VD{(max + 1).ToString("D4")}";
            }

            disease.VaccinationID = vaccineId;
            await _vaccineTypeRepository.CreateVaccineDiseaseAsync(disease);
        }

        public async Task UpdateVaccineDiseasesAsync(string vaccineId, List<VaccineDiseaseDto> diseases)
        {
            if (!await _vaccineTypeRepository.VaccineTypeExistsAsync(vaccineId))
                throw new KeyNotFoundException("Vaccine type not found");

            // Lấy danh sách bệnh hiện tại
            var existingDiseases = await _vaccineTypeRepository.GetDiseasesByVaccineIdAsync(vaccineId);
            var existingDiseasesList = existingDiseases.ToList();

            // Xử lý từng bệnh trong danh sách mới
            for (int i = 0; i < diseases.Count; i++)
            {
                var diseaseDto = diseases[i];
                
                if (i < existingDiseasesList.Count)
                {
                    // Cập nhật bệnh hiện có
                    var existingDisease = existingDiseasesList[i];
                    existingDisease.DiseaseName = diseaseDto.DiseaseName;
                    existingDisease.RequiredDoses = diseaseDto.RequiredDoses;
                    existingDisease.IntervalBetweenDoses = diseaseDto.IntervalBetweenDoses;
                    
                    await _vaccineTypeRepository.UpdateVaccineDiseaseAsync(existingDisease);
                }
                else
                {
                    // Thêm bệnh mới nếu cần
                    var newDisease = new VaccineDisease
                    {
                        VaccinationID = vaccineId,
                        DiseaseName = diseaseDto.DiseaseName,
                        RequiredDoses = diseaseDto.RequiredDoses,
                        IntervalBetweenDoses = diseaseDto.IntervalBetweenDoses
                    };

                    // Sinh mã tự động cho disease mới
                    var allDiseases = await _vaccineTypeRepository.GetAllVaccineDiseasesAsync();
                    int max = 0;
                    foreach (var d in allDiseases)
                    {
                        if (d.VaccineDiseaseID != null && d.VaccineDiseaseID.StartsWith("VD"))
                        {
                            var numPart = d.VaccineDiseaseID.Substring(2);
                            if (int.TryParse(numPart, out int n) && n > max)
                                max = n;
                        }
                    }
                    newDisease.VaccineDiseaseID = $"VD{(max + 1).ToString("D4")}";

                    await _vaccineTypeRepository.CreateVaccineDiseaseAsync(newDisease);
                }
            }

            // Xóa các bệnh thừa nếu danh sách mới ngắn hơn danh sách cũ
            if (diseases.Count < existingDiseasesList.Count)
            {
                for (int i = diseases.Count; i < existingDiseasesList.Count; i++)
                {
                    var diseaseToDelete = existingDiseasesList[i];
                    // Có thể thêm method DeleteVaccineDiseaseAsync nếu cần
                    // Hoặc sử dụng DeleteAllDiseasesForVaccineAsync và tạo lại
                }
            }
        }
    }
}