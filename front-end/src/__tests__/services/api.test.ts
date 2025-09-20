import { vehicleApi, calculateDistance, getUserLocation } from '../../services/api';
import axios from 'axios';
import { Vehicle } from '../../types/Vehicle';

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('vehicleApi', () => {
    const mockVehicle: Vehicle = {
      id: '1',
      identifier: 'Vehicle 1',
      license_plate: 'AAA-9A99',
      tracker_serial_number: 'A0000000',
      coordinates: {
        latitude: -25.43247,
        longitude: -49.27845
      }
    };

    describe('getVehicles', () => {
      it('should fetch vehicles successfully', async () => {
        const mockResponse = { data: { vehicles: [mockVehicle] } };
        mockedAxios.get.mockResolvedValue(mockResponse);

        const result = await vehicleApi.getVehicles();

        expect(mockedAxios.get).toHaveBeenCalledWith('/api/vehicles');
        expect(result).toEqual([mockVehicle]);
      });

      it('should handle response without vehicles wrapper', async () => {
        const mockResponse = { data: [mockVehicle] };
        mockedAxios.get.mockResolvedValue(mockResponse);

        const result = await vehicleApi.getVehicles();

        expect(result).toEqual([mockVehicle]);
      });

      it('should throw error on failure', async () => {
        mockedAxios.get.mockRejectedValue(new Error('Network error'));

        await expect(vehicleApi.getVehicles()).rejects.toThrow('Failed to fetch vehicles');
      });
    });

    describe('getVehicleById', () => {
      it('should fetch vehicle by id successfully', async () => {
        const mockResponse = { data: { vehicle: mockVehicle } };
        mockedAxios.get.mockResolvedValue(mockResponse);

        const result = await vehicleApi.getVehicleById('1');

        expect(mockedAxios.get).toHaveBeenCalledWith('/api/vehicles/1');
        expect(result).toEqual(mockVehicle);
      });

      it('should handle response without vehicle wrapper', async () => {
        const mockResponse = { data: mockVehicle };
        mockedAxios.get.mockResolvedValue(mockResponse);

        const result = await vehicleApi.getVehicleById('1');

        expect(result).toEqual(mockVehicle);
      });

      it('should throw error on failure', async () => {
        mockedAxios.get.mockRejectedValue(new Error('Network error'));

        await expect(vehicleApi.getVehicleById('1')).rejects.toThrow('Failed to fetch vehicle');
      });
    });

    describe('createVehicle', () => {
      const newVehicle = {
        identifier: 'Vehicle 1',
        license_plate: 'AAA-9A99',
        tracker_serial_number: 'A0000000',
        coordinates: {
          latitude: -25.43247,
          longitude: -49.27845
        }
      };

      it('should create vehicle successfully', async () => {
        const mockResponse = { data: { vehicle: mockVehicle } };
        mockedAxios.post.mockResolvedValue(mockResponse);

        const result = await vehicleApi.createVehicle(newVehicle);

        expect(mockedAxios.post).toHaveBeenCalledWith('/api/vehicles', newVehicle);
        expect(result).toEqual(mockVehicle);
      });

      it('should handle response without vehicle wrapper', async () => {
        const mockResponse = { data: mockVehicle };
        mockedAxios.post.mockResolvedValue(mockResponse);

        const result = await vehicleApi.createVehicle(newVehicle);

        expect(result).toEqual(mockVehicle);
      });

      it('should throw error on failure', async () => {
        mockedAxios.post.mockRejectedValue(new Error('Network error'));

        await expect(vehicleApi.createVehicle(newVehicle)).rejects.toThrow('Failed to create vehicle');
      });
    });

    describe('updateVehicle', () => {
      const updateData = { identifier: 'Updated Vehicle' };

      it('should update vehicle successfully', async () => {
        const updatedVehicle = { ...mockVehicle, ...updateData };
        const mockResponse = { data: { vehicle: updatedVehicle } };
        mockedAxios.put.mockResolvedValue(mockResponse);

        const result = await vehicleApi.updateVehicle('1', updateData);

        expect(mockedAxios.put).toHaveBeenCalledWith('/api/vehicles/1', updateData);
        expect(result).toEqual(updatedVehicle);
      });

      it('should throw error on failure', async () => {
        mockedAxios.put.mockRejectedValue(new Error('Network error'));

        await expect(vehicleApi.updateVehicle('1', updateData)).rejects.toThrow('Failed to update vehicle');
      });
    });

    describe('deleteVehicle', () => {
      it('should delete vehicle successfully', async () => {
        mockedAxios.delete.mockResolvedValue({});

        await vehicleApi.deleteVehicle('1');

        expect(mockedAxios.delete).toHaveBeenCalledWith('/api/vehicles/1');
      });

      it('should throw error on failure', async () => {
        mockedAxios.delete.mockRejectedValue(new Error('Network error'));

        await expect(vehicleApi.deleteVehicle('1')).rejects.toThrow('Failed to delete vehicle');
      });
    });
  });

  describe('calculateDistance', () => {
    it('should calculate distance between two coordinates', () => {
      const lat1 = -25.4284;
      const lon1 = -49.2733;
      const lat2 = -25.43247;
      const lon2 = -49.27845;

      const distance = calculateDistance(lat1, lon1, lat2, lon2);

      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(1);
      expect(typeof distance).toBe('number');
    });

    it('should return 0 for same coordinates', () => {
      const distance = calculateDistance(0, 0, 0, 0);
      expect(distance).toBe(0);
    });

    it('should calculate distance for different hemispheres', () => {
      const distance = calculateDistance(40.7128, -74.0060, -33.8688, 151.2093);
      expect(distance).toBeGreaterThan(15000);
    });
  });

  describe('getUserLocation', () => {
    const mockGeolocation = {
      getCurrentPosition: jest.fn(),
      watchPosition: jest.fn(),
      clearWatch: jest.fn()
    };

    beforeEach(() => {
      Object.defineProperty(global.navigator, 'geolocation', {
        value: mockGeolocation,
        configurable: true
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should get user location successfully', async () => {
      const mockPosition = {
        coords: {
          latitude: -25.4284,
          longitude: -49.2733
        }
      };

      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success(mockPosition);
      });

      const result = await getUserLocation();

      expect(result).toEqual({
        latitude: -25.4284,
        longitude: -49.2733
      });
    });

    it('should reject when geolocation is not supported', async () => {
      Object.defineProperty(global.navigator, 'geolocation', {
        value: undefined,
        configurable: true
      });

      await expect(getUserLocation()).rejects.toThrow('Geolocation is not supported by this browser.');
    });

    it('should reject on geolocation error', async () => {
      const mockError = { message: 'Permission denied' };

      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error(mockError);
      });

      await expect(getUserLocation()).rejects.toThrow('Geolocation error: Permission denied');
    });
  });
});
