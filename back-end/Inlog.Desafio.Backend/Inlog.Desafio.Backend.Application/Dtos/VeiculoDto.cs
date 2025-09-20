using Inlog.Desafio.Backend.Domain.Models;

namespace Inlog.Desafio.Backend.Application.Dtos;

public class VeiculoDto
{
    public string Identifier { get; set; }
    public string LicensePlate { get; set; }
    public string TrackerSerialNumber { get; set; }
    public CoordinatesDto Coordinates { get; set; }
    public string? Image { get; set; }
}
