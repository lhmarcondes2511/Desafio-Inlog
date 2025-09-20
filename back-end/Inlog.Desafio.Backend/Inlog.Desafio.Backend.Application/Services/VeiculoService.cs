using Inlog.Desafio.Backend.Application.Dtos;
using Inlog.Desafio.Backend.Domain.Models;
using Inlog.Desafio.Backend.Domain.Repositories;

namespace Inlog.Desafio.Backend.Application.Services;

public class VeiculoService : IVeiculoService
{
    private readonly IVeiculoRepository _repository;

    public VeiculoService(IVeiculoRepository repository)
    {
        _repository = repository;
    }

    public async Task<VeiculoDto> CadastrarAsync(VehicleCreateDto dto)
    {
        var exists = await _repository.ExistsAsync(dto.Identifier);
        if (exists) throw new InvalidOperationException("Duplicado");

        var entity = new Veiculo
        {
            Identifier = dto.Identifier,
            LicensePlate = dto.LicensePlate,
            TrackerSerialNumber = dto.TrackerSerialNumber,
            Latitude = dto.Coordinates?.Latitude ?? 0,
            Longitude = dto.Coordinates?.Longitude ?? 0,
            Image = dto.Image
        };

        await _repository.AddAsync(entity);

        return new VeiculoDto
        {
            Identifier = entity.Identifier,
            LicensePlate = entity.LicensePlate,
            TrackerSerialNumber = entity.TrackerSerialNumber,
            Coordinates = new CoordinatesDto { Latitude = entity.Latitude, Longitude = entity.Longitude },
            Image = entity.Image
        };
    }

    public async Task<IReadOnlyList<VeiculoDto>> ListarAsync()
    {
        var itens = await _repository.GetAllAsync();
        var list = itens.Select(v => new VeiculoDto
        {
            Identifier = v.Identifier,
            LicensePlate = v.LicensePlate,
            TrackerSerialNumber = v.TrackerSerialNumber,
            Coordinates = new CoordinatesDto { Latitude = v.Latitude, Longitude = v.Longitude },
            Image = v.Image
        }).ToList();
        return list;
    }
}
