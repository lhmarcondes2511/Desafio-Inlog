using Inlog.Desafio.Backend.Domain.Models;

namespace Inlog.Desafio.Backend.Application.Dtos;

public class VeiculoCreateDto
{
    public string Chassi { get; set; }
    public TipoVeiculo TipoVeiculo { get; set; }
    public string Cor { get; set; }
}
