# Build stage
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

# Copy solution and project files for restore caching
COPY Inlog.Desafio.Backend.sln ./
COPY Inlog.Desafio.Backend.Application/Inlog.Desafio.Backend.Application.csproj Inlog.Desafio.Backend.Application/
COPY Inlog.Desafio.Backend.Domain/Inlog.Desafio.Backend.Domain.csproj Inlog.Desafio.Backend.Domain/
COPY Inlog.Desafio.Backend.Infra.Database/Inlog.Desafio.Backend.Infra.Database.csproj Inlog.Desafio.Backend.Infra.Database/
COPY Inlog.Desafio.Backend.WebApi/Inlog.Desafio.Backend.WebApi.csproj Inlog.Desafio.Backend.WebApi/

RUN dotnet restore Inlog.Desafio.Backend.WebApi/Inlog.Desafio.Backend.WebApi.csproj

# Copy the rest of the source
COPY . .

# Publish the Web API
WORKDIR /src/Inlog.Desafio.Backend.WebApi
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final
WORKDIR /app

# Configure ASP.NET Core to listen on port 8080 by default
ENV ASPNETCORE_URLS=http://+:8080
# Set environment to Production by default (compose will override to Testing for local)
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Inlog.Desafio.Backend.WebApi.dll"]
