export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Vehicle {
  id?: string;
  identifier: string;
  license_plate: string;
  tracker_serial_number: string;
  coordinates: Coordinates;
  image?: string;
  created_at?: string;
}

export interface VehicleFormData {
  identifier: string;
  license_plate: string;
  tracker_serial_number: string;
  coordinates: Coordinates;
  image?: string;
}
