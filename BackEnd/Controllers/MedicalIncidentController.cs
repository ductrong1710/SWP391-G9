using Microsoft.AspNetCore.Mvc;
using Businessobjects.Models;
using Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicalIncidentController : ControllerBase
    {
        private readonly IMedicalIncidentService _medicalIncidentService;

        public MedicalIncidentController(IMedicalIncidentService medicalIncidentService)
        {
            _medicalIncidentService = medicalIncidentService;
        }

        // GET: api/MedicalIncident
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicalIncident>>> GetMedicalIncidents()
        {
            var incidents = await _medicalIncidentService.GetAllMedicalIncidentsAsync();
            return Ok(incidents);
        }

        // GET: api/MedicalIncident/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MedicalIncident>> GetMedicalIncident(string id)
        {
            var incident = await _medicalIncidentService.GetMedicalIncidentByIdAsync(id);
            if (incident == null)
                return NotFound();
            return Ok(incident);
        }
    }
} 