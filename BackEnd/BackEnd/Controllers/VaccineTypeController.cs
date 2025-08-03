using Microsoft.AspNetCore.Mvc;
using Businessobjects.Models;
using Services;
using Services.Interfaces;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VaccineTypeController : ControllerBase
    {
        private readonly IVaccineTypeService _vaccineTypeService;

        public VaccineTypeController(IVaccineTypeService vaccineTypeService)
        {
            _vaccineTypeService = vaccineTypeService;
        }

        // GET: api/VaccineType
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VaccineType>>> GetVaccineTypes()
        {
            var vaccineTypes = await _vaccineTypeService.GetAllVaccineTypesAsync();
            return Ok(vaccineTypes);
        }

        // GET: api/VaccineType/with-diseases
        [HttpGet("with-diseases")]
        public async Task<ActionResult<IEnumerable<object>>> GetVaccineTypesWithDiseases()
        {
            var vaccineTypes = await _vaccineTypeService.GetAllVaccineTypesAsync();
            
            var result = vaccineTypes.Select(v => {
                var diseases = v.VaccineDiseases?.ToList() ?? new List<VaccineDisease>();
                
                // Gộp thông tin vaccine
                var vaccineInfo = new
                {
                    VaccinationID = v.VaccinationID,
                    VaccineName = v.VaccineName,
                    Description = v.Description,
                    // Thông tin tổng hợp từ các bệnh
                    TotalDiseases = diseases.Count,
                    DiseaseNames = diseases.Select(d => d.DiseaseName).ToList(),
                    // Lấy thông tin chung (giả sử tất cả bệnh có cùng số mũi và khoảng cách)
                    RequiredDoses = diseases.FirstOrDefault()?.RequiredDoses ?? 0,
                    IntervalBetweenDoses = diseases.FirstOrDefault()?.IntervalBetweenDoses ?? 0,
                    // Giữ lại thông tin chi tiết từng bệnh nếu cần
                    Diseases = diseases.Select(d => new
                    {
                        DiseaseName = d.DiseaseName,
                        RequiredDoses = d.RequiredDoses,
                        IntervalBetweenDoses = d.IntervalBetweenDoses
                    }).Cast<object>().ToList()
                };
                
                return vaccineInfo;
            });
            
            return Ok(result);
        }

        // GET: api/VaccineType/5
        [HttpGet("{id}")]
        public async Task<ActionResult<VaccineType>> GetVaccineType(string id)
        {
            var vaccineType = await _vaccineTypeService.GetVaccineTypeByIdAsync(id);
            if (vaccineType == null)
                return NotFound();

            return Ok(vaccineType);
        }

        // GET: api/VaccineType/5/with-diseases
        [HttpGet("{id}/with-diseases")]
        public async Task<ActionResult<object>> GetVaccineTypeWithDiseases(string id)
        {
            var vaccineType = await _vaccineTypeService.GetVaccineTypeByIdAsync(id);
            if (vaccineType == null)
                return NotFound();

            var diseases = vaccineType.VaccineDiseases?.Select(d => new
            {
                DiseaseName = d.DiseaseName,
                RequiredDoses = d.RequiredDoses,
                IntervalBetweenDoses = d.IntervalBetweenDoses
            }).Cast<object>().ToList() ?? new List<object>();

            var result = new
            {
                VaccinationID = vaccineType.VaccinationID,
                VaccineName = vaccineType.VaccineName,
                Description = vaccineType.Description,
                Diseases = diseases
            };

            return Ok(result);
        }

        // POST: api/VaccineType
        [HttpPost]
        public async Task<ActionResult<VaccineType>> CreateVaccineType(VaccineType vaccineType)
        {
            try
            {
                var createdVaccineType = await _vaccineTypeService.CreateVaccineTypeAsync(vaccineType);
                return CreatedAtAction(nameof(GetVaccineType), new { id = createdVaccineType.VaccinationID }, createdVaccineType);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        // POST: api/VaccineType/with-diseases
        [HttpPost("with-diseases")]
        public async Task<ActionResult<object>> CreateVaccineTypeWithDiseases(VaccineTypeDto vaccineDto)
        {
            try
            {
                // Tạo vaccine type
                var vaccineType = new VaccineType
                {
                    VaccineName = vaccineDto.VaccineName,
                    Description = vaccineDto.Description
                };

                var createdVaccineType = await _vaccineTypeService.CreateVaccineTypeAsync(vaccineType);

                // Tạo các bệnh tương ứng nếu có
                if (vaccineDto.Diseases != null && vaccineDto.Diseases.Any())
                {
                    foreach (var diseaseDto in vaccineDto.Diseases)
                    {
                        var disease = new VaccineDisease
                        {
                            VaccinationID = createdVaccineType.VaccinationID,
                            DiseaseName = diseaseDto.DiseaseName,
                            RequiredDoses = diseaseDto.RequiredDoses,
                            IntervalBetweenDoses = diseaseDto.IntervalBetweenDoses
                        };

                        // Thêm bệnh vào database
                        await _vaccineTypeService.AddDiseaseToVaccineAsync(createdVaccineType.VaccinationID, disease);
                    }
                }

                // Trả về vaccine với bệnh
                var diseases = vaccineDto.Diseases?.Select(d => new
                {
                    DiseaseName = d.DiseaseName,
                    RequiredDoses = d.RequiredDoses,
                    IntervalBetweenDoses = d.IntervalBetweenDoses
                }).Cast<object>().ToList() ?? new List<object>();

                var result = new
                {
                    VaccinationID = createdVaccineType.VaccinationID,
                    VaccineName = createdVaccineType.VaccineName,
                    Description = createdVaccineType.Description,
                    Diseases = diseases
                };

                return CreatedAtAction(nameof(GetVaccineTypeWithDiseases), new { id = createdVaccineType.VaccinationID }, result);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/VaccineType/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVaccineType(string id, VaccineType vaccineType)
        {
            try
            {
                Console.WriteLine($"Controller: UpdateVaccineType called with id: {id}");
                Console.WriteLine($"Controller: Request body - VaccinationID: {vaccineType.VaccinationID}, VaccineName: {vaccineType.VaccineName}, Description: {vaccineType.Description}");
                
                if (id != vaccineType.VaccinationID)
                {
                    Console.WriteLine($"Controller: ID mismatch - {id} != {vaccineType.VaccinationID}");
                    return BadRequest("ID mismatch");
                }

                await _vaccineTypeService.UpdateVaccineTypeAsync(id, vaccineType);
                Console.WriteLine($"Controller: Update completed successfully, returning NoContent");
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                Console.WriteLine($"Controller: KeyNotFoundException - {ex.Message}");
                return NotFound(ex.Message);
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine($"Controller: ArgumentException - {ex.Message}");
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"Controller: InvalidOperationException - {ex.Message}");
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Controller: Exception - {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/VaccineType/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVaccineType(string id)
        {
            try
            {
                await _vaccineTypeService.DeleteVaccineTypeAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/VaccineType/{id}/diseases
        [HttpPut("{id}/diseases")]
        public async Task<ActionResult<object>> UpdateVaccineDiseases(string id, List<VaccineDiseaseDto> diseases)
        {
            try
            {
                await _vaccineTypeService.UpdateVaccineDiseasesAsync(id, diseases);
                
                // Trả về vaccine với bệnh đã cập nhật
                var vaccineType = await _vaccineTypeService.GetVaccineTypeByIdAsync(id);
                if (vaccineType == null)
                    return NotFound();

                var result = new
                {
                    VaccinationID = vaccineType.VaccinationID,
                    VaccineName = vaccineType.VaccineName,
                    Description = vaccineType.Description,
                    Diseases = vaccineType.VaccineDiseases?.Select(d => new
                    {
                        DiseaseName = d.DiseaseName,
                        RequiredDoses = d.RequiredDoses
                    }).Cast<object>().ToList() ?? new List<object>()
                };

                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}