using FluentValidation;
using Inlog.Desafio.Backend.Application.Dtos;
using System.Text.RegularExpressions;

namespace Inlog.Desafio.Backend.Application.Validators;

public class VehicleCreateDtoValidator : AbstractValidator<VehicleCreateDto>
{
    public VehicleCreateDtoValidator()
    {
        RuleFor(x => x.Identifier)
            .NotEmpty().WithMessage("identifier é obrigatório");

        RuleFor(x => x.LicensePlate)
            .NotEmpty().WithMessage("license_plate é obrigatório")
            .Matches(new Regex("^[A-Z]{3}-?[0-9][A-Z0-9][0-9]{2}$", RegexOptions.IgnoreCase))
            .WithMessage("license_plate inválida");

        RuleFor(x => x.TrackerSerialNumber)
            .NotEmpty().WithMessage("tracker_serial_number é obrigatório");

        RuleFor(x => x.Coordinates)
            .NotNull().WithMessage("coordinates é obrigatório");

        When(x => x.Coordinates != null, () =>
        {
            RuleFor(x => x.Coordinates.Latitude)
                .InclusiveBetween(-90, 90).WithMessage("latitude deve estar entre -90 e 90");

            RuleFor(x => x.Coordinates.Longitude)
                .InclusiveBetween(-180, 180).WithMessage("longitude deve estar entre -180 e 180");
        });

        RuleFor(x => x.Image)
            .Must(uri => string.IsNullOrEmpty(uri) || Uri.IsWellFormedUriString(uri, UriKind.Absolute))
            .WithMessage("image deve ser uma URL válida quando fornecida");
    }
}
