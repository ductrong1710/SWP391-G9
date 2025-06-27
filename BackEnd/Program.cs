using Businessobjects.Data;
using Microsoft.EntityFrameworkCore;
using Repositories;
using Repositories.Implements;
using Repositories.Interfaces;
using Services;
using Services.Interfaces;
using Services.interfaces;
using Services.implements;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IProfileRepository, ProfileRepository>();
builder.Services.AddScoped<IHealthRecordRepository, HealthRecordRepository>();
builder.Services.AddScoped<IMedicalSupplyRepository, MedicalSupplyRepository>();
builder.Services.AddScoped<IMedicationRepository, MedicationRepository>();
builder.Services.AddScoped<IMedicationSubmissionFormRepository, MedicationSubmissionFormRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IPeriodicHealthCheckPlanRepository, PeriodicHealthCheckPlanRepository>();
builder.Services.AddScoped<IHealthCheckConsentFormRepository, HealthCheckConsentFormRepository>();
builder.Services.AddScoped<IHealthCheckResultRepository, HealthCheckResultRepository>();
builder.Services.AddScoped<IVaccineTypeRepository, VaccineTypeRepository>();
builder.Services.AddScoped<IVaccinationPlanRepository, VaccinationPlanRepository>();
builder.Services.AddScoped<IVaccinationConsentFormRepository, VaccinationConsentFormRepository>();
builder.Services.AddScoped<IVaccinationResultRepository, VaccinationResultRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();

// Register services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<IHealthRecordService, HealthRecordService>();
builder.Services.AddScoped<IMedicalSupplyService, MedicalSupplyService>();
builder.Services.AddScoped<IMedicationService, MedicationService>();
builder.Services.AddScoped<IMedicationSubmissionFormService, MedicationSubmissionFormService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IPeriodicHealthCheckPlanService, PeriodicHealthCheckPlanService>();
builder.Services.AddScoped<IHealthCheckConsentFormService, HealthCheckConsentFormService>();
builder.Services.AddScoped<IHealthCheckResultService, HealthCheckResultService>();
builder.Services.AddScoped<IVaccineTypeService, VaccineTypeService>();
builder.Services.AddScoped<IVaccinationPlanService, VaccinationPlanService>();
builder.Services.AddScoped<IVaccinationConsentFormService, VaccinationConsentFormService>();
builder.Services.AddScoped<IVaccinationResultService, VaccinationResultService>();
builder.Services.AddScoped<INotificationService, NotificationService>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
