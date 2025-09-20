import { createServer, Model, Factory, Response } from 'miragejs';
import { Vehicle } from '../types/Vehicle';

export function makeServer({ environment = 'development' } = {}) {
  return createServer({
    environment,

    models: {
      vehicle: Model.extend<Partial<Vehicle>>({})
    },

    factories: {
      vehicle: Factory.extend({
        identifier(i: number) {
          return `Vehicle ${i + 1}`;
        },
        license_plate(i: number) {
          const letters = ['AAA', 'BBB', 'CCC', 'DDD', 'EEE'];
          const numbers = String(1000 + i).slice(-4);
          return `${letters[i % letters.length]}-${numbers}`;
        },
        tracker_serial_number(i: number) {
          return `A${String(1000000 + i).slice(-7)}`;
        },
        coordinates() {
          const baseLat = -25.4284;
          const baseLng = -49.2733;
          return {
            latitude: baseLat + (Math.random() - 0.5) * 0.1,
            longitude: baseLng + (Math.random() - 0.5) * 0.1
          };
        },
        created_at() {
          return new Date().toISOString();
        }
      })
    },

    seeds(server) {
      server.createList('vehicle', 10);
    },

    routes() {
      this.namespace = 'api';

      this.get('/vehicles', (schema) => {
        return schema.all('vehicle');
      });

      this.get('/vehicles/:id', (schema, request) => {
        const id = request.params.id;
        const vehicle = schema.find('vehicle', id);
        
        if (!vehicle) {
          return new Response(404, {}, { error: 'Vehicle not found' });
        }
        return new Response(200, {}, vehicle.attrs);
      });

      this.post('/vehicles', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        
        if (!attrs.identifier || !attrs.license_plate || !attrs.tracker_serial_number) {
          return new Response(400, {}, { 
            error: 'Missing required fields: identifier, license_plate, tracker_serial_number' 
          });
        }

        if (!attrs.coordinates || !attrs.coordinates.latitude || !attrs.coordinates.longitude) {
          return new Response(400, {}, { 
            error: 'Missing required coordinates (latitude and longitude)' 
          });
        }

        const vehicle = schema.create('vehicle', {
          ...attrs,
          id: Date.now().toString(),
          created_at: new Date().toISOString()
        });
        return new Response(201, {}, vehicle.attrs);
      });

      this.put('/vehicles/:id', (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const vehicle = schema.find('vehicle', id);
        
        if (!vehicle) {
          return new Response(404, {}, { error: 'Vehicle not found' });
        }
        vehicle.update(attrs);
        return new Response(200, {}, vehicle.attrs);
      });

      this.delete('/vehicles/:id', (schema, request) => {
        const id = request.params.id;
        const vehicle = schema.find('vehicle', id);
        
        if (!vehicle) {
          return new Response(404, {}, { error: 'Vehicle not found' });
        }
        
        vehicle.destroy();
        return new Response(204);
      });

      this.passthrough();
    }
  });
}

