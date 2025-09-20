using System.Text.Json.Serialization;
using FluentValidation;
using FluentValidation.AspNetCore;
using Inlog.Desafio.Backend.Application.Services;
using Inlog.Desafio.Backend.Application.Dtos;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<Inlog.Desafio.Backend.Domain.Repositories.IVeiculoRepository, Inlog.Desafio.Backend.Infra.Database.Repositories.VeiculoInMemoryRepository>();
builder.Services.AddScoped<IVeiculoService, VeiculoService>();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<VeiculoCreateDto>();
builder.Services.AddValidatorsFromAssemblyContaining<VehicleCreateDto>();

const string CorsPolicyName = "AllowFrontend";
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicyName, policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",
                "http://localhost:5173",
                "https://localhost:5173",
                "http://127.0.0.1:5173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (app.Environment.IsDevelopment() || app.Environment.IsEnvironment("Testing"))
{
    app.UseDeveloperExceptionPage();
}

if (!app.Environment.IsEnvironment("Testing"))
{
    app.UseHttpsRedirection();
}

app.UseCors(CorsPolicyName);

app.UseAuthorization();

app.MapControllers();

app.Run();

public partial class Program { }
