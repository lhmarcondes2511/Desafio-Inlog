using Inlog.Desafio.Backend.Domain.Models;
using Inlog.Desafio.Backend.Domain.Repositories;
using System.Collections.Concurrent;

namespace Inlog.Desafio.Backend.Infra.Database.Repositories;

public class VeiculoInMemoryRepository : IVeiculoRepository
{
    private readonly ConcurrentDictionary<string, Veiculo> _data = new();

    public Task AddAsync(Veiculo veiculo)
    {
        _data[veiculo.Identifier] = veiculo;
        return Task.CompletedTask;
    }

    public Task<IReadOnlyList<Veiculo>> GetAllAsync()
    {
        var list = _data.Values.ToList();
        return Task.FromResult((IReadOnlyList<Veiculo>)list);
    }

    public Task<bool> ExistsAsync(string identifier)
    {
        var exists = _data.ContainsKey(identifier);
        return Task.FromResult(exists);
    }
}
