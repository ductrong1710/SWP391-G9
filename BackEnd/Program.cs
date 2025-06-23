using Businessobjects.Data;
using Microsoft.EntityFrameworkCore;
using Repositories;
using Repositories.Implements;
using Repositories.Interfaces;
using Services;
using Services.Interfaces;
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

// Register services
builder.Services.AddScoped<Services.Interfaces.IUserService, UserService>();
builder.Services.AddScoped<Services.Interfaces.IProfileService, ProfileService>();
builder.Services.AddScoped<Services.Interfaces.IHealthRecordService, HealthRecordService>();
builder.Services.AddScoped<Services.Interfaces.IMedicalSupplyService, MedicalSupplyService>();
builder.Services.AddScoped<Services.Interfaces.IMedicationService, MedicationService>();
builder.Services.AddScoped<Services.Interfaces.IMedicationSubmissionFormService, MedicationSubmissionFormService>();
builder.Services.AddScoped<Services.Interfaces.IRoleService, RoleService>();
builder.Services.AddScoped<Services.Interfaces.IPeriodicHealthCheckPlanService, PeriodicHealthCheckPlanService>();
builder.Services.AddScoped<Services.Interfaces.IHealthCheckConsentFormService, HealthCheckConsentFormService>();
builder.Services.AddScoped<Services.Interfaces.IHealthCheckResultService, HealthCheckResultService>();
builder.Services.AddScoped<Services.Interfaces.IVaccineTypeService, VaccineTypeService>();
builder.Services.AddScoped<Services.Interfaces.IVaccinationPlanService, VaccinationPlanService>();
builder.Services.AddScoped<Services.Interfaces.IVaccinationConsentFormService, VaccinationConsentFormService>();
builder.Services.AddScoped<Services.Interfaces.IVaccinationResultService, VaccinationResultService>();
builder.Services.AddScoped<Services.Interfaces.IAuthService, Services.Implements.AuthService>();

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
