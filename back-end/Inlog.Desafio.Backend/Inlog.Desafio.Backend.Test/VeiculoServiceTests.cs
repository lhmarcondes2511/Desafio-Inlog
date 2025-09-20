using Inlog.Desafio.Backend.Application.Dtos;
using Inlog.Desafio.Backend.Application.Services;
using Inlog.Desafio.Backend.Domain.Models;
using Inlog.Desafio.Backend.Domain.Repositories;
using Moq;
using Xunit;

namespace Inlog.Desafio.Backend.Test;

public class VeiculoServiceTests
{
    [Fact]
    public async Task CadastrarAsync_ComNovoChassi_IncluiESetaRetorno()
    {
        var repo = new Mock<IVeiculoRepository>();
        repo.Setup(r => r.ExistsAsync("XYZ"))
            .ReturnsAsync(false);
        var service = new VeiculoService(repo.Object);
        var dto = new VeiculoCreateDto { Chassi = "XYZ", Cor = "Preto", TipoVeiculo = TipoVeiculo.Caminhao };

        var result = await service.CadastrarAsync(dto);

        Assert.Equal("XYZ", result.Chassi);
        Assert.Equal("Preto", result.Cor);
        Assert.Equal(TipoVeiculo.Caminhao, result.TipoVeiculo);
        repo.Verify(r => r.AddAsync(It.Is<Veiculo>(v => v.Chassi == "XYZ")), Times.Once);
    }

    [Fact]
    public async Task CadastrarAsync_ComChassiExistente_DisparaExcecao()
    {
        var repo = new Mock<IVeiculoRepository>();
        repo.Setup(r => r.ExistsAsync("DUP"))
            .ReturnsAsync(true);
        var service = new VeiculoService(repo.Object);
        var dto = new VeiculoCreateDto { Chassi = "DUP", Cor = "Azul", TipoVeiculo = TipoVeiculo.Onibus };

        await Assert.ThrowsAsync<InvalidOperationException>(() => service.CadastrarAsync(dto));
    }
}
