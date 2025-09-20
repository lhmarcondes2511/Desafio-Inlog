using System.Text.Json.Serialization;

namespace Inlog.Desafio.Backend.Application.Dtos;

public class VehicleCreateDto
{
    [JsonPropertyName("identifier")]
    public string Identifier { get; set; }

    [JsonPropertyName("license_plate")]
    public string LicensePlate { get; set; }

    [JsonPropertyName("tracker_serial_number")]
    public string TrackerSerialNumber { get; set; }

    [JsonPropertyName("coordinates")]
    public CoordinatesDto Coordinates { get; set; }

    [JsonPropertyName("image")]
    public string? Image { get; set; }
}

public class CoordinatesDto
{
    [JsonPropertyName("latitude")]
    public double Latitude { get; set; }

    [JsonPropertyName("longitude")]
    public double Longitude { get; set; }
}
