import { Vehicle, Coordinates, VehicleFormData } from '../../types/Vehicle';

describe('Vehicle Types', () => {
  describe('Coordinates interface', () => {
    it('should have latitude and longitude properties', () => {
      const coordinates: Coordinates = {
        latitude: -25.43247,
        longitude: -49.27845
      };

      expect(coordinates.latitude).toBe(-25.43247);
      expect(coordinates.longitude).toBe(-49.27845);
    });
  });

  describe('Vehicle interface', () => {
    it('should create a valid vehicle object', () => {
      const vehicle: Vehicle = {
        id: '1',
        identifier: 'Vehicle 1',
        license_plate: 'AAA-9A99',
        tracker_serial_number: 'A0000000',
        coordinates: {
          latitude: -25.43247,
          longitude: -49.27845
        },
        image: 'https://example.com/image.jpg',
        created_at: '2023-01-01T00:00:00.000Z'
      };

      expect(vehicle.id).toBe('1');
      expect(vehicle.identifier).toBe('Vehicle 1');
      expect(vehicle.license_plate).toBe('AAA-9A99');
      expect(vehicle.tracker_serial_number).toBe('A0000000');
      expect(vehicle.coordinates.latitude).toBe(-25.43247);
      expect(vehicle.coordinates.longitude).toBe(-49.27845);
      expect(vehicle.image).toBe('https://example.com/image.jpg');
      expect(vehicle.created_at).toBe('2023-01-01T00:00:00.000Z');
    });

    it('should work with optional properties', () => {
      const vehicle: Vehicle = {
        identifier: 'Vehicle 1',
        license_plate: 'AAA-9A99',
        tracker_serial_number: 'A0000000',
        coordinates: {
          latitude: -25.43247,
          longitude: -49.27845
        }
      };

      expect(vehicle.id).toBeUndefined();
      expect(vehicle.image).toBeUndefined();
      expect(vehicle.created_at).toBeUndefined();
    });
  });

  describe('VehicleFormData interface', () => {
    it('should create valid form data', () => {
      const formData: VehicleFormData = {
        identifier: 'Vehicle 1',
        license_plate: 'AAA-9A99',
        tracker_serial_number: 'A0000000',
        coordinates: {
          latitude: -25.43247,
          longitude: -49.27845
        },
        image: 'https://example.com/image.jpg'
      };

      expect(formData.identifier).toBe('Vehicle 1');
      expect(formData.license_plate).toBe('AAA-9A99');
      expect(formData.tracker_serial_number).toBe('A0000000');
      expect(formData.coordinates.latitude).toBe(-25.43247);
      expect(formData.coordinates.longitude).toBe(-49.27845);
      expect(formData.image).toBe('https://example.com/image.jpg');
    });
  });
});
