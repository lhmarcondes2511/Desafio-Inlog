import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import VehicleRegister from '../../pages/VehicleRegister';
import { VehicleProvider } from '../../contexts/VehicleContext';
import { vehicleApi } from '../../services/api';

jest.mock('../../services/api');
const mockedVehicleApi = vehicleApi as jest.Mocked<typeof vehicleApi>;

const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn()
};

const renderWithProviders = () => {
  return render(
    <BrowserRouter>
      <VehicleProvider>
        <VehicleRegister />
      </VehicleProvider>
    </BrowserRouter>
  );
};

describe('VehicleRegister', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    
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

  it('should render page header', () => {
    renderWithProviders();
    
    expect(screen.getByText('Cadastro de Veículo')).toBeInTheDocument();
    expect(screen.getByText('Preencha as informações do veículo para cadastrá-lo no sistema')).toBeInTheDocument();
  });

  it('should render all form fields', () => {
    renderWithProviders();
    
    expect(screen.getByLabelText(/Identificador do Veículo/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Placa do Veículo/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Número Serial do Rastreador/)).toBeInTheDocument();
    expect(screen.getByLabelText(/URL da Imagem/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Latitude/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Longitude/)).toBeInTheDocument();
  });

  it('should render form buttons', () => {
    renderWithProviders();
    
    expect(screen.getByText('Limpar Formulário')).toBeInTheDocument();
    expect(screen.getByText('Cadastrar Veículo')).toBeInTheDocument();
    expect(screen.getByText('📍 Usar minha localização atual')).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    renderWithProviders();
    
    const submitButton = screen.getByText('Cadastrar Veículo');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Identificador é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Placa é obrigatória')).toBeInTheDocument();
      expect(screen.getByText('Número serial é obrigatório')).toBeInTheDocument();
    });
  });

  it('should validate plate format', async () => {
    renderWithProviders();
    
    const plateInput = screen.getByLabelText(/Placa do Veículo/);
    await user.type(plateInput, 'INVALID');
    
    const submitButton = screen.getByText('Cadastrar Veículo');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Formato de placa inválido (ex: ABC-1234 ou ABC-1A23)')).toBeInTheDocument();
    });
  });

  it('should validate coordinates range', async () => {
    renderWithProviders();
    
    const latInput = screen.getByLabelText(/Latitude/);
    const lngInput = screen.getByLabelText(/Longitude/);
    
    await user.type(latInput, '100');
    await user.type(lngInput, '200');
    
    const submitButton = screen.getByText('Cadastrar Veículo');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Latitude deve estar entre -90 e 90')).toBeInTheDocument();
      expect(screen.getByText('Longitude deve estar entre -180 e 180')).toBeInTheDocument();
    });
  });

  it('should get current location when button is clicked', async () => {
    renderWithProviders();
    
    const locationButton = screen.getByText('📍 Usar minha localização atual');
    fireEvent.click(locationButton);
    
    await waitFor(() => {
      expect(screen.getByText('✅ Localização atual obtida')).toBeInTheDocument();
    });
    
    const latInput = screen.getByLabelText(/Latitude/) as HTMLInputElement;
    const lngInput = screen.getByLabelText(/Longitude/) as HTMLInputElement;
    
    expect(latInput.value).toBe('-25.4284');
    expect(lngInput.value).toBe('-49.2733');
  });

  it('should handle geolocation error', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error({ message: 'Permission denied' });
    });
    
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    renderWithProviders();
    
    const locationButton = screen.getByText('📍 Usar minha localização atual');
    fireEvent.click(locationButton);
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Não foi possível obter sua localização. Por favor, insira as coordenadas manualmente.');
    });
    
    alertSpy.mockRestore();
  });

  it('should submit form successfully', async () => {
    const mockVehicle = {
      id: '1',
      identifier: 'Test Vehicle',
      license_plate: 'AAA-1234',
      tracker_serial_number: 'T123456',
      coordinates: { latitude: -25.4284, longitude: -49.2733 }
    };
    
    mockedVehicleApi.createVehicle.mockResolvedValue(mockVehicle);
    
    renderWithProviders();
    
    await user.type(screen.getByLabelText(/Identificador do Veículo/), 'Test Vehicle');
    await user.type(screen.getByLabelText(/Placa do Veículo/), 'AAA-1234');
    await user.type(screen.getByLabelText(/Número Serial do Rastreador/), 'T123456');
    await user.type(screen.getByLabelText(/Latitude/), '-25.4284');
    await user.type(screen.getByLabelText(/Longitude/), '-49.2733');
    
    const submitButton = screen.getByText('Cadastrar Veículo');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('✅ Veículo cadastrado com sucesso!')).toBeInTheDocument();
    });
    
    expect(mockedVehicleApi.createVehicle).toHaveBeenCalledWith({
      identifier: 'Test Vehicle',
      license_plate: 'AAA-1234',
      tracker_serial_number: 'T123456',
      coordinates: { latitude: -25.4284, longitude: -49.2733 },
      image: undefined
    });
  });

  it('should handle API error on submit', async () => {
    mockedVehicleApi.createVehicle.mockRejectedValue(new Error('API Error'));
    
    renderWithProviders();
    
    await user.type(screen.getByLabelText(/Identificador do Veículo/), 'Test Vehicle');
    await user.type(screen.getByLabelText(/Placa do Veículo/), 'AAA-1234');
    await user.type(screen.getByLabelText(/Número Serial do Rastreador/), 'T123456');
    await user.type(screen.getByLabelText(/Latitude/), '-25.4284');
    await user.type(screen.getByLabelText(/Longitude/), '-49.2733');
    
    const submitButton = screen.getByText('Cadastrar Veículo');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('❌ API Error')).toBeInTheDocument();
    });
  });

  it('should clear form when clear button is clicked', async () => {
    renderWithProviders();
    
    await user.type(screen.getByLabelText(/Identificador do Veículo/), 'Test Vehicle');
    await user.type(screen.getByLabelText(/Placa do Veículo/), 'AAA-1234');
    
    const clearButton = screen.getByText('Limpar Formulário');
    fireEvent.click(clearButton);
    
    const identifierInput = screen.getByLabelText(/Identificador do Veículo/) as HTMLInputElement;
    const plateInput = screen.getByLabelText(/Placa do Veículo/) as HTMLInputElement;
    
    expect(identifierInput.value).toBe('');
    expect(plateInput.value).toBe('');
  });

  it('should show coordinates preview when values are entered', async () => {
    renderWithProviders();
    
    await user.type(screen.getByLabelText(/Latitude/), '-25.4284');
    await user.type(screen.getByLabelText(/Longitude/), '-49.2733');
    
    await waitFor(() => {
      expect(screen.getByText('Coordenadas: -25.4284, -49.2733')).toBeInTheDocument();
    });
  });

  it('should disable buttons during submission', async () => {
    mockedVehicleApi.createVehicle.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
    
    renderWithProviders();
    
    await user.type(screen.getByLabelText(/Identificador do Veículo/), 'Test Vehicle');
    await user.type(screen.getByLabelText(/Placa do Veículo/), 'AAA-1234');
    await user.type(screen.getByLabelText(/Número Serial do Rastreador/), 'T123456');
    await user.type(screen.getByLabelText(/Latitude/), '-25.4284');
    await user.type(screen.getByLabelText(/Longitude/), '-49.2733');
    
    const submitButton = screen.getByText('Cadastrar Veículo');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Cadastrando...')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Limpar Formulário')).toBeDisabled();
  });

  it('should render back link', () => {
    renderWithProviders();
    
    const backLink = screen.getByText('← Voltar para lista de veículos');
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest('a')).toHaveAttribute('href', '/');
  });

  it('should auto-dismiss success message', async () => {
    jest.useFakeTimers();
    
    const mockVehicle = {
      id: '1',
      identifier: 'Test Vehicle',
      license_plate: 'AAA-1234',
      tracker_serial_number: 'T123456',
      coordinates: { latitude: -25.4284, longitude: -49.2733 }
    };
    
    mockedVehicleApi.createVehicle.mockResolvedValue(mockVehicle);
    
    renderWithProviders();
    
    await user.type(screen.getByLabelText(/Identificador do Veículo/), 'Test Vehicle');
    await user.type(screen.getByLabelText(/Placa do Veículo/), 'AAA-1234');
    await user.type(screen.getByLabelText(/Número Serial do Rastreador/), 'T123456');
    await user.type(screen.getByLabelText(/Latitude/), '-25.4284');
    await user.type(screen.getByLabelText(/Longitude/), '-49.2733');
    
    const submitButton = screen.getByText('Cadastrar Veículo');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('✅ Veículo cadastrado com sucesso!')).toBeInTheDocument();
    });
    
    jest.advanceTimersByTime(5000);
    
    await waitFor(() => {
      expect(screen.queryByText('✅ Veículo cadastrado com sucesso!')).not.toBeInTheDocument();
    });
    
    jest.useRealTimers();
  });
});
