import React from 'react';
import { render, screen } from '@testing-library/react';
import VehicleMap from '../../components/VehicleMap';
import { Vehicle } from '../../types/Vehicle';

// Mock any potential CSS imports or external dependencies
jest.mock('../../components/VehicleMap.css', () => ({}), { virtual: true });

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    identifier: 'Vehicle 1',
    license_plate: 'AAA-1234',
    tracker_serial_number: 'T123456',
    coordinates: { latitude: -25.4284, longitude: -49.2733 }
  },
  {
    id: '2',
    identifier: 'Vehicle 2',
    license_plate: 'BBB-5678',
    tracker_serial_number: 'T789012',
    coordinates: { latitude: -25.5, longitude: -49.3 }
  }
];

const mockUserLocation = {
  latitude: -25.4284,
  longitude: -49.2733
};

describe('VehicleMap', () => {
  it('should render map placeholder', () => {
    render(<VehicleMap vehicles={[]} />);
    
    expect(screen.getByText('🗺️ Mapa dos Veículos')).toBeInTheDocument();
    expect(screen.getByText('Aguardando instalação do React Leaflet...')).toBeInTheDocument();
  });

  it('should display user location when provided', () => {
    render(<VehicleMap vehicles={[]} userLocation={mockUserLocation} />);
    
    expect(screen.getByText('📍 Sua localização:')).toBeInTheDocument();
    expect(screen.getByText('Lat: -25.428400')).toBeInTheDocument();
    expect(screen.getByText('Lng: -49.273300')).toBeInTheDocument();
  });

  it('should not display user location when not provided', () => {
    render(<VehicleMap vehicles={[]} />);
    
    expect(screen.queryByText('📍 Sua localização:')).not.toBeInTheDocument();
  });

  it('should display vehicles count', () => {
    render(<VehicleMap vehicles={mockVehicles} />);
    
    expect(screen.getByText('🚗 Veículos (2):')).toBeInTheDocument();
  });

  it('should display no vehicles message when empty', () => {
    render(<VehicleMap vehicles={[]} />);
    
    expect(screen.getByText('🚗 Veículos (0):')).toBeInTheDocument();
    expect(screen.getByText('Nenhum veículo para exibir')).toBeInTheDocument();
  });

  it('should display vehicle information', () => {
    render(<VehicleMap vehicles={mockVehicles} />);
    
    expect(screen.getByText('Vehicle 1')).toBeInTheDocument();
    expect(screen.getByText('Vehicle 2')).toBeInTheDocument();
    expect(screen.getByText('Lat: -25.4284, Lng: -49.2733')).toBeInTheDocument();
    expect(screen.getByText('Lat: -25.5000, Lng: -49.3000')).toBeInTheDocument();
  });

  it('should limit displayed vehicles to 5', () => {
    const manyVehicles: Vehicle[] = Array.from({ length: 7 }, (_, i) => ({
      id: `${i + 1}`,
      identifier: `Vehicle ${i + 1}`,
      license_plate: `AAA-${1000 + i}`,
      tracker_serial_number: `T${100000 + i}`,
      coordinates: { latitude: -25.4 + i * 0.1, longitude: -49.2 + i * 0.1 }
    }));

    render(<VehicleMap vehicles={manyVehicles} />);
    
    expect(screen.getByText('🚗 Veículos (7):')).toBeInTheDocument();
    expect(screen.getByText('Vehicle 1')).toBeInTheDocument();
    expect(screen.getByText('Vehicle 5')).toBeInTheDocument();
    expect(screen.getByText('... e mais 2 veículos')).toBeInTheDocument();
    expect(screen.queryByText('Vehicle 6')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <VehicleMap vehicles={[]} className="custom-map-class" />
    );
    
    const mapElement = container.querySelector('.map-placeholder');
    expect(mapElement).toHaveClass('custom-map-class');
  });

  it('should render with both vehicles and user location', () => {
    render(
      <VehicleMap 
        vehicles={mockVehicles} 
        userLocation={mockUserLocation} 
        className="test-class"
      />
    );
    
    expect(screen.getByText('🗺️ Mapa dos Veículos')).toBeInTheDocument();
    expect(screen.getByText('📍 Sua localização:')).toBeInTheDocument();
    expect(screen.getByText('🚗 Veículos (2):')).toBeInTheDocument();
    expect(screen.getByText('Vehicle 1')).toBeInTheDocument();
    expect(screen.getByText('Vehicle 2')).toBeInTheDocument();
  });

  it('should handle vehicles without id', () => {
    const vehiclesWithoutId = mockVehicles.map(({ id, ...vehicle }) => vehicle);
    
    render(<VehicleMap vehicles={vehiclesWithoutId as Vehicle[]} />);
    
    expect(screen.getByText('Vehicle 1')).toBeInTheDocument();
    expect(screen.getByText('Vehicle 2')).toBeInTheDocument();
  });
});
