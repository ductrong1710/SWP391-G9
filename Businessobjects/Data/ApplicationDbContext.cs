using Microsoft.EntityFrameworkCore;
using Businessobjects.Models;

namespace Businessobjects.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Profile> Profiles { get; set; }
        public DbSet<HealthRecord> HealthRecords { get; set; }
        public DbSet<MedicalSupply> MedicalSupplies { get; set; }
        public DbSet<Medication> Medications { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<MedicationSubmissionForm> MedicationSubmissionForms { get; set; }
        public DbSet<PeriodicHealthCheckPlan> PeriodicHealthCheckPlans { get; set; }
        public DbSet<HealthCheckConsentForm> HealthCheckConsentForms { get; set; }
        public DbSet<HealthCheckResult> HealthCheckResults { get; set; }
        public DbSet<VaccineType> VaccinationTypes { get; set; }
        public DbSet<VaccinationPlan> VaccinationPlans { get; set; }
        public DbSet<VaccinationConsentForm> VaccinationConsentForms { get; set; }
        public DbSet<VaccinationResult> VaccinationResults { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure existing relationships
            ConfigureExistingRelationships(modelBuilder);

            // Configure vaccination-related relationships
            ConfigureVaccinationRelationships(modelBuilder);

            // Configure health check result relationships
            ConfigureHealthCheckResultRelationships(modelBuilder);

            // Seed data
            SeedData(modelBuilder);
        }

        private void ConfigureExistingRelationships(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Profile>()
                .HasOne(p => p.User)
                .WithOne()
                .HasForeignKey<Profile>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<HealthRecord>()
                .HasOne(h => h.Student)
                .WithMany()
                .HasForeignKey(h => h.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MedicationSubmissionForm>()
                .HasOne(m => m.Student)
                .WithMany()
                .HasForeignKey(m => m.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PeriodicHealthCheckPlan>()
                .HasOne(p => p.Creator)
                .WithMany()
                .HasForeignKey(p => p.CreatorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<HealthCheckConsentForm>()
                .HasOne(h => h.HealthCheckPlan)
                .WithMany(p => p.ConsentForms)
                .HasForeignKey(h => h.HealthCheckPlanId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<HealthCheckConsentForm>()
                .HasOne(h => h.Student)
                .WithMany()
                .HasForeignKey(h => h.StudentId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        private void ConfigureVaccinationRelationships(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<VaccinationPlan>()
                .HasOne(p => p.Creator)
                .WithMany()
                .HasForeignKey(p => p.CreatorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<VaccinationConsentForm>()
                .HasOne(f => f.VaccinationPlan)
                .WithMany(p => p.ConsentForms)
                .HasForeignKey(f => f.VaccinationPlanId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<VaccinationConsentForm>()
                .HasOne(f => f.Student)
                .WithMany()
                .HasForeignKey(f => f.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<VaccinationResult>()
                .HasOne(r => r.ConsentForm)
                .WithOne(f => f.VaccinationResult)
                .HasForeignKey<VaccinationResult>(r => r.ConsentFormId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<VaccinationResult>()
                .HasOne(r => r.VaccineType)
                .WithMany(t => t.VaccinationResults)
                .HasForeignKey(r => r.VaccineTypeId)
                .OnDelete(DeleteBehavior.Restrict);
        }

        private void ConfigureHealthCheckResultRelationships(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<HealthCheckResult>()
                .HasOne(r => r.HealthCheckConsent)
                .WithOne()
                .HasForeignKey<HealthCheckResult>(r => r.HealthCheckConsentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<HealthCheckResult>()
                .Property(r => r.Height)
                .HasColumnType("decimal(5,2)");

            modelBuilder.Entity<HealthCheckResult>()
                .Property(r => r.Weight)
                .HasColumnType("decimal(5,2)");
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Role seed data
            modelBuilder.Entity<Role>().HasData(
                new Role { RoleId = 1, RoleType = "Admin" },
                new Role { RoleId = 2, RoleType = "User" },
                new Role { RoleId = 3, RoleType = "Nurse" },
                new Role { RoleId = 4, RoleType = "Teacher" }
            );

            // Example seed data with fixed GUIDs
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    UserId = new Guid("c9d4c053-49b6-410c-bc78-2d54a9991870"),
                    Username = "admin",
                    Password = "admin123",
                    Role = "Admin"
                },
                new User
                {
                    UserId = new Guid("d8663e5e-7494-4f81-8739-6e0de1bea7ee"),
                    Username = "user",
                    Password = "user123",
                    Role = "User"
                },
                new User
                {
                    UserId = new Guid("b9e7d454-99df-4506-8c0f-3b2c33c21d12"),
                    Username = "nurse",
                    Password = "nurse123",
                    Role = "Nurse"
                }
            );

            // Profile seed data
            modelBuilder.Entity<Profile>().HasData(
    new
    {
        ProfileId = new Guid("f5b7824f-5e35-4682-98d1-0e98f8dd6b31"),
        Name = "Admin User",
        DateOfBirth = new DateTime(1990, 1, 1),
        Sex = "Male",
        Class = "Admin Class",
        Phone = "1234567890",
        UserId = new Guid("c9d4c053-49b6-410c-bc78-2d54a9991870"),
        Note = "Admin profile"
    }
);

            // Example health record seed data
            modelBuilder.Entity<HealthRecord>().HasData(
                new
                {
                    HealthRecordId = new Guid("a2b4c6d8-e0f2-4681-9314-123456789012"),
                    StudentId = new Guid("f5b7824f-5e35-4682-98d1-0e98f8dd6b31"),
                    ParentId = "P12345",
                    Allergies = "None",
                    ChronicDiseases = "None",
                    TreatmentHistory = "No major treatments",
                    Eyesight = "20/20",
                    Hearing = "Normal",
                    VaccinationHistory = "Up to date",
                    Note = "Healthy student",
                    ParentContact = "0987654321"
                }
            );
        }
    }
}