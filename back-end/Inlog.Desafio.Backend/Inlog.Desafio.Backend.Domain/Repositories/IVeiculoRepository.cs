using Inlog.Desafio.Backend.Domain.Models;

namespace Inlog.Desafio.Backend.Domain.Repositories;

public interface IVeiculoRepository
{
    Task AddAsync(Veiculo veiculo);
    Task<IReadOnlyList<Veiculo>> GetAllAsync();
    Task<bool> ExistsAsync(string identifier);
}
