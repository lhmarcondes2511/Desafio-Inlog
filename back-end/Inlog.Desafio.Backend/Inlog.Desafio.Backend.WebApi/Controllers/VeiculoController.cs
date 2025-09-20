using Microsoft.AspNetCore.Mvc;
using Inlog.Desafio.Backend.Application.Dtos;
using Inlog.Desafio.Backend.Application.Services;
using Inlog.Desafio.Backend.Domain.Models;
using FluentValidation;
using System.Linq;

namespace Inlog.Desafio.Backend.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class VeiculoController : ControllerBase
{
    private readonly ILogger<VeiculoController> _logger;
    private readonly IVeiculoService _service;

    public VeiculoController(ILogger<VeiculoController> logger, IVeiculoService service)
    {
        _logger = logger;
        _service = service;
    }

    [HttpPost("Cadastrar")]
    public async Task<IActionResult> Cadastrar([FromBody] VehicleCreateDto dto, [FromServices] IValidator<VehicleCreateDto> validator)
    {
        if (dto is null) return BadRequest();
        var validation = await validator.ValidateAsync(dto);
        if (!validation.IsValid)
        {
            return BadRequest(validation.Errors.Select(e => e.ErrorMessage));
        }

        try
        {
            var result = await _service.CadastrarAsync(dto);
            return Created("/Veiculo/Listar", result);
        }
        catch (InvalidOperationException)
        {
            return Conflict();
        }
    }

    [HttpGet("Listar")]
    public async Task<IActionResult> ListarVeiculosAsync()
    {
        var itens = await _service.ListarAsync();
        return Ok(itens);
    }
}
