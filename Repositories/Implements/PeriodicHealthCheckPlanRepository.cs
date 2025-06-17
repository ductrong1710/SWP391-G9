using Businessobjects.Data;
using Businessobjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implements
{
    public class PeriodicHealthCheckPlanRepository : IPeriodicHealthCheckPlanRepository
    {
        private readonly ApplicationDbContext _context;

        public PeriodicHealthCheckPlanRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PeriodicHealthCheckPlan>> GetAllPlansAsync()
        {
            return await _context.PeriodicHealthCheckPlans
                .Include(p => p.Creator)
                .Include(p => p.ConsentForms)
                .ToListAsync();
        }

        public async Task<PeriodicHealthCheckPlan?> GetPlanByIdAsync(int id)
        {
            return await _context.PeriodicHealthCheckPlans
                .Include(p => p.Creator)
                .Include(p => p.ConsentForms)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<PeriodicHealthCheckPlan>> GetPlansByCreatorIdAsync(Guid creatorId)
        {
            return await _context.PeriodicHealthCheckPlans
                .Include(p => p.Creator)
                .Include(p => p.ConsentForms)
                .Where(p => p.CreatorId == creatorId)
                .ToListAsync();
        }

        public async Task<IEnumerable<PeriodicHealthCheckPlan>> GetUpcomingPlansAsync()
        {
            return await _context.PeriodicHealthCheckPlans
                .Include(p => p.Creator)
                .Include(p => p.ConsentForms)
                .Where(p => p.ScheduleDate > DateTime.Now)
                .OrderBy(p => p.ScheduleDate)
                .ToListAsync();
        }

        public async Task CreatePlanAsync(PeriodicHealthCheckPlan plan)
        {
            await _context.PeriodicHealthCheckPlans.AddAsync(plan);
            await _context.SaveChangesAsync();
        }

        public async Task UpdatePlanAsync(PeriodicHealthCheckPlan plan)
        {
            _context.Entry(plan).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeletePlanAsync(int id)
        {
            var plan = await GetPlanByIdAsync(id);
            if (plan != null)
            {
                _context.PeriodicHealthCheckPlans.Remove(plan);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> PlanExistsAsync(int id)
        {
            return await _context.PeriodicHealthCheckPlans.AnyAsync(p => p.Id == id);
        }
    }
}