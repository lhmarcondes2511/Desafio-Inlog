using Inlog.Desafio.Backend.Domain.Models;
using Inlog.Desafio.Backend.Infra.Database.Repositories;
using Xunit;

namespace Inlog.Desafio.Backend.Test;

public class VeiculoInMemoryRepositoryTests
{
    [Fact]
    public async Task AddAsync_Then_GetAllAsync_Returns_Inserted_Item()
    {
        var repo = new VeiculoInMemoryRepository();
        var veiculo = new Veiculo
        {
            Chassi = "ABC123",
            TipoVeiculo = TipoVeiculo.Onibus,
            Cor = "Azul"
        };

        await repo.AddAsync(veiculo);
        var all = await repo.GetAllAsync();

        Assert.Single(all);
        Assert.Equal("ABC123", all[0].Chassi);
        Assert.Equal(TipoVeiculo.Onibus, all[0].TipoVeiculo);
        Assert.Equal("Azul", all[0].Cor);
    }
}
