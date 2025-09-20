import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { VehicleProvider, useVehicles } from '../../contexts/VehicleContext';
import { Vehicle } from '../../types/Vehicle';

const TestComponent = () => {
  const {
    vehicles,
    loading,
    error,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    setVehicles,
    setLoading,
    setError
  } = useVehicles();

  return (
    <div>
      <div data-testid="vehicles-count">{vehicles.length}</div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="error">{error || 'no-error'}</div>
      <button
        onClick={() => addVehicle({
          id: '1',
          identifier: 'Test Vehicle',
          license_plate: 'AAA-1234',
          tracker_serial_number: 'T123456',
          coordinates: { latitude: -25.4284, longitude: -49.2733 }
        })}
        data-testid="add-vehicle"
      >
        Add Vehicle
      </button>
      <button
        onClick={() => updateVehicle('1', { identifier: 'Updated Vehicle' })}
        data-testid="update-vehicle"
      >
        Update Vehicle
      </button>
      <button
        onClick={() => deleteVehicle('1')}
        data-testid="delete-vehicle"
      >
        Delete Vehicle
      </button>
      <button
        onClick={() => setVehicles([{
          id: '2',
          identifier: 'Set Vehicle',
          license_plate: 'BBB-5678',
          tracker_serial_number: 'T789012',
          coordinates: { latitude: -25.5, longitude: -49.3 }
        }])}
        data-testid="set-vehicles"
      >
        Set Vehicles
      </button>
      <button
        onClick={() => setLoading(true)}
        data-testid="set-loading"
      >
        Set Loading
      </button>
      <button
        onClick={() => setError('Test error')}
        data-testid="set-error"
      >
        Set Error
      </button>
      {vehicles.map(vehicle => (
        <div key={vehicle.id} data-testid={`vehicle-${vehicle.id}`}>
          {vehicle.identifier}
        </div>
      ))}
    </div>
  );
};

describe('VehicleContext', () => {
  const renderWithProvider = () => {
    return render(
      <VehicleProvider>
        <TestComponent />
      </VehicleProvider>
    );
  };

  it('should provide initial state', () => {
    renderWithProvider();

    expect(screen.getByTestId('vehicles-count')).toHaveTextContent('0');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('no-error');
  });

  it('should add vehicle', () => {
    renderWithProvider();

    act(() => {
      screen.getByTestId('add-vehicle').click();
    });

    expect(screen.getByTestId('vehicles-count')).toHaveTextContent('1');
    expect(screen.getByTestId('vehicle-1')).toHaveTextContent('Test Vehicle');
  });

  it('should update vehicle', () => {
    renderWithProvider();

    act(() => {
      screen.getByTestId('add-vehicle').click();
    });

    act(() => {
      screen.getByTestId('update-vehicle').click();
    });

    expect(screen.getByTestId('vehicle-1')).toHaveTextContent('Updated Vehicle');
  });

  it('should delete vehicle', () => {
    renderWithProvider();

    act(() => {
      screen.getByTestId('add-vehicle').click();
    });

    expect(screen.getByTestId('vehicles-count')).toHaveTextContent('1');

    act(() => {
      screen.getByTestId('delete-vehicle').click();
    });

    expect(screen.getByTestId('vehicles-count')).toHaveTextContent('0');
  });

  it('should set vehicles', () => {
    renderWithProvider();

    act(() => {
      screen.getByTestId('set-vehicles').click();
    });

    expect(screen.getByTestId('vehicles-count')).toHaveTextContent('1');
    expect(screen.getByTestId('vehicle-2')).toHaveTextContent('Set Vehicle');
  });

  it('should set loading state', () => {
    renderWithProvider();

    act(() => {
      screen.getByTestId('set-loading').click();
    });

    expect(screen.getByTestId('loading')).toHaveTextContent('true');
  });

  it('should set error state', () => {
    renderWithProvider();

    act(() => {
      screen.getByTestId('set-error').click();
    });

    expect(screen.getByTestId('error')).toHaveTextContent('Test error');
  });

  it('should generate id and created_at when adding vehicle without them', () => {
    renderWithProvider();

    const vehicleWithoutId: Omit<Vehicle, 'id' | 'created_at'> = {
      identifier: 'No ID Vehicle',
      license_plate: 'CCC-9999',
      tracker_serial_number: 'T999999',
      coordinates: { latitude: -25.4, longitude: -49.2 }
    };

    act(() => {
      screen.getByTestId('add-vehicle').click();
    });

    expect(screen.getByTestId('vehicles-count')).toHaveTextContent('1');
  });

  it('should throw error when useVehicles is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useVehicles must be used within a VehicleProvider');

    consoleError.mockRestore();
  });

  it('should handle multiple vehicle operations', () => {
    renderWithProvider();

    act(() => {
      screen.getByTestId('add-vehicle').click();
    });

    act(() => {
      screen.getByTestId('set-vehicles').click();
    });

    expect(screen.getByTestId('vehicles-count')).toHaveTextContent('1');
    expect(screen.getByTestId('vehicle-2')).toHaveTextContent('Set Vehicle');
    expect(screen.queryByTestId('vehicle-1')).not.toBeInTheDocument();
  });
});
