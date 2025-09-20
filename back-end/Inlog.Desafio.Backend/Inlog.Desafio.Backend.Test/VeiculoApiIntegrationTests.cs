using System.Net;
using System.Net.Http.Json;
using Inlog.Desafio.Backend.Application.Dtos;
using Inlog.Desafio.Backend.Domain.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;
using Inlog.Desafio.Backend.Domain.Repositories;
using Inlog.Desafio.Backend.Infra.Database.Repositories;
using System.Text.Json;
using System.Text.Json.Serialization;
using Xunit;
using Xunit.Abstractions;
using Microsoft.AspNetCore.Hosting;

namespace Inlog.Desafio.Backend.Test;

[CollectionDefinition("NonParallel", DisableParallelization = true)]
public class NonParallelCollection { }

[Collection("NonParallel")]
public class VeiculoApiIntegrationTests
{
    private readonly ITestOutputHelper _output;
    public VeiculoApiIntegrationTests(ITestOutputHelper output)
    {
        _output = output;
    }
    private WebApplicationFactory<Program> CreateFactory()
    {
        return new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.UseSetting(WebHostDefaults.EnvironmentKey, "Testing");
            builder.ConfigureServices(services =>
            {
                var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(IVeiculoRepository));
                if (descriptor != null) services.Remove(descriptor);
                services.AddSingleton<IVeiculoRepository>(new VeiculoInMemoryRepository());
            });
        });
    }

    [Fact]
    public async Task Post_Cadastrar_Then_Get_Listar_ReturnsItem()
    {
        var client = CreateFactory().CreateClient();
        var payload = new VeiculoCreateDto
        {
            Chassi = "INT001",
            Cor = "Branco",
            TipoVeiculo = TipoVeiculo.Onibus
        };

        var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase, Converters = { new JsonStringEnumConverter() } };
        var post = await client.PostAsJsonAsync("/Veiculo/Cadastrar", payload, jsonOptions);
        _output.WriteLine($"POST /Veiculo/Cadastrar => {(int)post.StatusCode} {post.StatusCode}");
        _output.WriteLine(await post.Content.ReadAsStringAsync());
        Assert.Equal(HttpStatusCode.Created, post.StatusCode);

        var get = await client.GetAsync("/Veiculo/Listar");
        _output.WriteLine($"GET /Veiculo/Listar => {(int)get.StatusCode} {get.StatusCode}");
        _output.WriteLine(await get.Content.ReadAsStringAsync());
        Assert.Equal(HttpStatusCode.OK, get.StatusCode);
        var list = await get.Content.ReadFromJsonAsync<List<VeiculoDto>>(new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            Converters = { new JsonStringEnumConverter() }
        });
        Assert.NotNull(list);
        Assert.Contains(list!, v => v.Chassi == "INT001" && v.Cor == "Branco" && v.TipoVeiculo == TipoVeiculo.Onibus);
    }

    [Fact]
    public async Task Post_Cadastrar_Duplicate_ReturnsConflict()
    {
        var client = CreateFactory().CreateClient();
        var payload = new VeiculoCreateDto
        {
            Chassi = "DUP001",
            Cor = "Preto",
            TipoVeiculo = TipoVeiculo.Caminhao
        };

        var jsonOptions = new JsonSerializerOptions { Converters = { new JsonStringEnumConverter() } };
        var first = await client.PostAsJsonAsync("/Veiculo/Cadastrar", payload, jsonOptions);
        _output.WriteLine($"POST1 /Veiculo/Cadastrar => {(int)first.StatusCode} {first.StatusCode}");
        _output.WriteLine(await first.Content.ReadAsStringAsync());
        Assert.Equal(HttpStatusCode.Created, first.StatusCode);

        var second = await client.PostAsJsonAsync("/Veiculo/Cadastrar", payload, jsonOptions);
        _output.WriteLine($"POST2 /Veiculo/Cadastrar => {(int)second.StatusCode} {second.StatusCode}");
        _output.WriteLine(await second.Content.ReadAsStringAsync());
        Assert.Equal(HttpStatusCode.Conflict, second.StatusCode);
    }

    [Fact]
    public async Task Post_Cadastrar_Invalid_ReturnsBadRequest()
    {
        var client = CreateFactory().CreateClient();
        var payload = new VeiculoCreateDto
        {
            Chassi = "",
            Cor = "",
            TipoVeiculo = (TipoVeiculo)999
        };

        var jsonOptions = new JsonSerializerOptions { Converters = { new JsonStringEnumConverter() } };
        var post = await client.PostAsJsonAsync("/Veiculo/Cadastrar", payload, jsonOptions);
        _output.WriteLine($"POST invalid /Veiculo/Cadastrar => {(int)post.StatusCode} {post.StatusCode}");
        _output.WriteLine(await post.Content.ReadAsStringAsync());
        Assert.Equal(HttpStatusCode.BadRequest, post.StatusCode);
    }
}
