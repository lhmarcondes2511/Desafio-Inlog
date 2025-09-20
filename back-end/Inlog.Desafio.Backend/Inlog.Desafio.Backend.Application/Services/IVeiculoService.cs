using Inlog.Desafio.Backend.Application.Dtos;

namespace Inlog.Desafio.Backend.Application.Services;

public interface IVeiculoService
{
    Task<VeiculoDto> CadastrarAsync(VehicleCreateDto dto);
    Task<IReadOnlyList<VeiculoDto>> ListarAsync();
}
