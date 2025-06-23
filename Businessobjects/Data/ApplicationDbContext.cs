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
                .HasForeignKey<Profile>(p => p.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<HealthRecord>()
                .HasOne(h => h.Student)
                .WithMany()
                .HasForeignKey(h => h.StudentID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MedicationSubmissionForm>()
                .HasOne(m => m.Student)
                .WithMany()
                .HasForeignKey(m => m.StudentID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PeriodicHealthCheckPlan>()
                .HasOne(p => p.Creator)
                .WithMany()
                .HasForeignKey(p => p.CreatorID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<HealthCheckConsentForm>()
                .HasOne(h => h.HealthCheckPlan)
                .WithMany(p => p.ConsentForms)
                .HasForeignKey(h => h.HealthCheckPlanID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<HealthCheckConsentForm>()
                .HasOne(h => h.Student)
                .WithMany()
                .HasForeignKey(h => h.StudentID)
                .OnDelete(DeleteBehavior.Cascade);
        }

        private void ConfigureVaccinationRelationships(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<VaccinationPlan>()
                .HasOne(p => p.Creator)
                .WithMany()
                .HasForeignKey(p => p.CreatorID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<VaccinationConsentForm>()
                .HasOne(f => f.VaccinationPlan)
                .WithMany()
                .HasForeignKey(f => f.VaccinationPlanID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<VaccinationConsentForm>()
                .HasOne(f => f.Student)
                .WithMany()
                .HasForeignKey(f => f.StudentID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<VaccinationResult>()
                .HasOne(r => r.ConsentForm)
                .WithOne()
                .HasForeignKey<VaccinationResult>(r => r.ConsentFormID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<VaccinationResult>()
                .HasOne(r => r.VaccineType)
                .WithMany()
                .HasForeignKey(r => r.VaccineTypeID)
                .OnDelete(DeleteBehavior.Restrict);
        }

        private void ConfigureHealthCheckResultRelationships(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<HealthCheckResult>()
                .HasOne(r => r.HealthCheckConsent)
                .WithOne()
                .HasForeignKey<HealthCheckResult>(r => r.HealthCheckConsentID)
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
                new Role { RoleID = "000001", RoleType = "Admin" },
                new Role { RoleID = "000002", RoleType = "User" },
                new Role { RoleID = "000003", RoleType = "Nurse" },
                new Role { RoleID = "000004", RoleType = "Teacher" }
            );

            // Example seed data
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    UserID = "U00001",
                    Username = "admin",
                    Password = "admin123",
                    RoleID = "000001"
                },
                new User
                {
                    UserID = "U00002",
                    Username = "user",
                    Password = "user123",
                    RoleID = "000002"
                },
                new User
                {
                    UserID = "U00003",
                    Username = "nurse",
                    Password = "nurse123",
                    RoleID = "000003"
                }
            );

            // Profile seed data
            modelBuilder.Entity<Profile>().HasData(
                new
                {
                    ProfileID = "P00001",
                    Name = "Admin User",
                    DateOfBirth = new DateTime(1990, 1, 1),
                    Sex = "Male",
                    Class = "Admin Class",
                    Phone = "1234567890",
                    UserID = "U00001",
                    Note = "Admin profile"
                }
            );

            // Example health record seed data
            modelBuilder.Entity<HealthRecord>().HasData(
                new
                {
                    HealthRecordID = "HR0001",
                    StudentID = "U00001",
                    ParentID = "U00002",
                    Allergies = "None",
                    ChronicDiseases = "None",
                    TreatmentHistory = "No major treatments",
                    Eyesight = 10,
                    Hearing = 10,
                    VaccinationHistory = "Up to date",
                    Note = "Healthy student",
                    ParentContact = "0987654321"
                }
            );
        }
    }
}