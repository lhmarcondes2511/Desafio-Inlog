import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VehicleList from '../../pages/VehicleList';
import { VehicleProvider } from '../../contexts/VehicleContext';
import { vehicleApi } from '../../services/api';
import { Vehicle } from '../../types/Vehicle';

jest.mock('../../services/api');
const mockedVehicleApi = vehicleApi as jest.Mocked<typeof vehicleApi>;

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    identifier: 'Vehicle 1',
    license_plate: 'AAA-1234',
    tracker_serial_number: 'T123456',
    coordinates: { latitude: -25.4284, longitude: -49.2733 },
    created_at: '2023-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    identifier: 'Vehicle 2',
    license_plate: 'BBB-5678',
    tracker_serial_number: 'T789012',
    coordinates: { latitude: -25.5, longitude: -49.3 },
    created_at: '2023-01-02T00:00:00.000Z'
  }
];

const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn()
};

const renderWithProviders = () => {
  return render(
    <BrowserRouter>
      <VehicleProvider>
        <VehicleList />
      </VehicleProvider>
    </BrowserRouter>
  );
};

describe('VehicleList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedVehicleApi.getVehicles.mockResolvedValue(mockVehicles);
    
    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      configurable: true
    });
    
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({
        coords: {
          latitude: -25.4284,
          longitude: -49.2733
        }
      });
    });
  });

  it('should render page header', async () => {
    renderWithProviders();
    
    expect(screen.getByText('Lista de Veículos')).toBeInTheDocument();
    expect(screen.getByText('Veículos ordenados por proximidade')).toBeInTheDocument();
  });

  it('should display loading state initially', () => {
    renderWithProviders();
    
    expect(screen.getByText('Carregando veículos...')).toBeInTheDocument();
  });

  it('should load and display vehicles', async () => {
    renderWithProviders();
    
    await waitFor(() => {
      expect(screen.getByText('Veículos (2)')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Vehicle 1')).toBeInTheDocument();
    expect(screen.getByText('Vehicle 2')).toBeInTheDocument();
    expect(screen.getByText('AAA-1234')).toBeInTheDocument();
    expect(screen.getByText('BBB-5678')).toBeInTheDocument();
  });

  it('should display vehicle details', async () => {
    renderWithProviders();
    
    await waitFor(() => {
      expect(screen.getByText('Vehicle 1')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Placa:')).toBeInTheDocument();
    expect(screen.getByText('Rastreador:')).toBeInTheDocument();
    expect(screen.getByText('Coordenadas:')).toBeInTheDocument();
    expect(screen.getByText('T123456')).toBeInTheDocument();
  });

  it('should display distance when user location is available', async () => {
    renderWithProviders();
    
    await waitFor(() => {
      expect(screen.getByText('Vehicle 1')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Distância:')).toBeInTheDocument();
    });
  });

  it('should handle API error', async () => {
    mockedVehicleApi.getVehicles.mockRejectedValue(new Error('API Error'));
    
    renderWithProviders();
    
    await waitFor(() => {
      expect(screen.getByText(/Erro:/)).toBeInTheDocument();
    });
    
    expect(screen.getByText('Tentar novamente')).toBeInTheDocument();
  });

  it('should retry loading vehicles on button click', async () => {
    mockedVehicleApi.getVehicles.mockRejectedValueOnce(new Error('API Error'));
    mockedVehicleApi.getVehicles.mockResolvedValueOnce(mockVehicles);
    
    renderWithProviders();
    
    await waitFor(() => {
      expect(screen.getByText('Tentar novamente')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Tentar novamente'));
    
    await waitFor(() => {
      expect(screen.getByText('Vehicle 1')).toBeInTheDocument();
    });
  });

  it('should refresh vehicles on refresh button click', async () => {
    renderWithProviders();
    
    await waitFor(() => {
      expect(screen.getByText('🔄 Atualizar')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('🔄 Atualizar'));
    
    expect(mockedVehicleApi.getVehicles).toHaveBeenCalledTimes(2);
  });

  it('should display empty state when no vehicles', async () => {
    mockedVehicleApi.getVehicles.mockResolvedValue([]);
    
    renderWithProviders();
    
    await waitFor(() => {
      expect(screen.getByText('Nenhum veículo encontrado.')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Cadastrar primeiro veículo')).toBeInTheDocument();
  });

  it('should handle geolocation error gracefully', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error({ message: 'Permission denied' });
    });
    
    renderWithProviders();
    
    await waitFor(() => {
      expect(screen.getByText('Vehicle 1')).toBeInTheDocument();
    });
  });

  it('should display vehicle position numbers', async () => {
    renderWithProviders();
    
    await waitFor(() => {
      expect(screen.getByText('Vehicle 1')).toBeInTheDocument();
    });
    
    const positionElements = screen.getAllByText(/^#\d+$/);
    expect(positionElements).toHaveLength(2);
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
  });

  it('should render map component', async () => {
    renderWithProviders();
    
    await waitFor(() => {
      expect(screen.getByText('Mapa dos Veículos')).toBeInTheDocument();
    });
    
    expect(screen.getByText('🗺️ Mapa dos Veículos')).toBeInTheDocument();
  });

  it('should format distance correctly', async () => {
    renderWithProviders();
    
    await waitFor(() => {
      expect(screen.getByText('Vehicle 1')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      const distanceElements = screen.getAllByText(/\d+(\.\d+)?(m|km)/);
      expect(distanceElements.length).toBeGreaterThan(0);
    });
  });
});
