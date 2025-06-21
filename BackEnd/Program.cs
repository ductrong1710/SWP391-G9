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

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", builder =>
    {
        builder.WithOrigins("http://localhost:3000") // React default port
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

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

// Register services
builder.Services.AddScoped<Services.interfaces.IUserService, UserService>();
builder.Services.AddScoped<Services.interfaces.IProfileService, ProfileService>();
builder.Services.AddScoped<Services.interfaces.IHealthRecordService, HealthRecordService>();
builder.Services.AddScoped<Services.interfaces.IMedicalSupplyService, MedicalSupplyService>();
builder.Services.AddScoped<Services.interfaces.IMedicationService, MedicationService>();
builder.Services.AddScoped<Services.interfaces.IMedicationSubmissionFormService, MedicationSubmissionFormService>();
builder.Services.AddScoped<Services.interfaces.IRoleService, RoleService>();
builder.Services.AddScoped<Services.interfaces.IPeriodicHealthCheckPlanService, PeriodicHealthCheckPlanService>();
builder.Services.AddScoped<Services.interfaces.IHealthCheckConsentFormService, HealthCheckConsentFormService>();
builder.Services.AddScoped<Services.Interfaces.IHealthCheckResultService, HealthCheckResultService>();
builder.Services.AddScoped<Services.interfaces.IVaccineTypeService, VaccineTypeService>();
builder.Services.AddScoped<Services.interfaces.IVaccinationPlanService, VaccinationPlanService>();
builder.Services.AddScoped<Services.interfaces.IVaccinationConsentFormService, VaccinationConsentFormService>();
builder.Services.AddScoped<Services.interfaces.IVaccinationResultService, VaccinationResultService>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use CORS middleware
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
