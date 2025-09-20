using FluentValidation;
using Inlog.Desafio.Backend.Application.Dtos;
using Inlog.Desafio.Backend.Domain.Models;

namespace Inlog.Desafio.Backend.Application.Validators;

public class VeiculoCreateDtoValidator : AbstractValidator<VeiculoCreateDto>
{
    public VeiculoCreateDtoValidator()
    {
        RuleFor(x => x.Chassi).NotEmpty();
        RuleFor(x => x.Cor).NotEmpty();
        RuleFor(x => x.TipoVeiculo).IsInEnum().Must(v => v == TipoVeiculo.Onibus || v == TipoVeiculo.Caminhao);
    }
}
