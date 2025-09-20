import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useVehicles } from '../contexts/VehicleContext';
import { vehicleApi, getUserLocation } from '../services/api';
import { VehicleFormData } from '../types/Vehicle';
import MapPicker from '../components/MapPicker';
import { useNavigate } from 'react-router-dom';

const VehicleRegister: React.FC = () => {
  const { addVehicle } = useVehicles();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<VehicleFormData>({
    defaultValues: {
      identifier: '',
      license_plate: '',
      tracker_serial_number: '',
      coordinates: {
        latitude: 0,
        longitude: 0
      },
      image: ''
    }
  });

  const watchedCoordinates = watch('coordinates');

  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess]);

  const handleGetCurrentLocation = async () => {
    try {
      setGettingLocation(true);
      const location = await getUserLocation();
      setValue('coordinates.latitude', location.latitude);
      setValue('coordinates.longitude', location.longitude);
      setUseCurrentLocation(true);
    } catch (error) {
      alert('Não foi possível obter sua localização. Por favor, insira as coordenadas manualmente.');
    } finally {
      setGettingLocation(false);
    }
  };

  const onSubmit = async (data: VehicleFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      if (!data.coordinates.latitude || !data.coordinates.longitude) {
        throw new Error('Coordenadas são obrigatórias');
      }
      const newVehicle = await vehicleApi.createVehicle({
        identifier: data.identifier,
        license_plate: data.license_plate,
        tracker_serial_number: data.tracker_serial_number,
        coordinates: {
          latitude: Number(data.coordinates.latitude),
          longitude: Number(data.coordinates.longitude)
        },
        image: data.image || undefined
      });
      addVehicle(newVehicle);
      setSubmitSuccess(true);
      setToast('✅ Veículo cadastrado com sucesso! Redirecionando...');
      reset();
      setUseCurrentLocation(false);
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Erro ao cadastrar veículo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-emerald-600 text-white px-4 py-3 rounded-md shadow-lg">
            {toast}
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cadastro de Veículo</h1>
          <p className="text-gray-600">Preencha as informações do veículo para cadastrá-lo no sistema</p>
        </header>

        <div className="bg-white rounded-lg shadow-md p-6">
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-green-800 font-medium">✅ Veículo cadastrado com sucesso!</span>
                <a 
                  href="/" 
                  className="text-green-600 hover:text-green-800 underline font-medium"
                >
                  Ver lista de veículos
                </a>
              </div>
            </div>
          )}

          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <span className="text-red-800 font-medium">❌ {submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
                    Identificador do Veículo *
                  </label>
                  <input
                    id="identifier"
                    type="text"
                    {...register('identifier', {
                      required: 'Identificador é obrigatório',
                      minLength: {
                        value: 2,
                        message: 'Identificador deve ter pelo menos 2 caracteres'
                      }
                    })}
                    placeholder="Ex: Caminhão 001"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.identifier ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.identifier && (
                    <p className="mt-1 text-sm text-red-600">{errors.identifier.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="license_plate" className="block text-sm font-medium text-gray-700 mb-2">
                    Placa do Veículo *
                  </label>
                  <input
                    id="license_plate"
                    type="text"
                    {...register('license_plate', {
                      required: 'Placa é obrigatória',
                      pattern: {
                        value: /^[A-Z]{3}-?[0-9][A-Z0-9][0-9]{2}$/,
                        message: 'Formato de placa inválido (ex: ABC-1234 ou ABC-1A23)'
                      }
                    })}
                    placeholder="Ex: ABC-1234"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.license_plate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.license_plate && (
                    <p className="mt-1 text-sm text-red-600">{errors.license_plate.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="tracker_serial_number" className="block text-sm font-medium text-gray-700 mb-2">
                    Número Serial do Rastreador *
                  </label>
                  <input
                    id="tracker_serial_number"
                    type="text"
                    {...register('tracker_serial_number', {
                      required: 'Número serial é obrigatório',
                      minLength: {
                        value: 5,
                        message: 'Número serial deve ter pelo menos 5 caracteres'
                      }
                    })}
                    placeholder="Ex: TRK123456789"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.tracker_serial_number ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.tracker_serial_number && (
                    <p className="mt-1 text-sm text-red-600">{errors.tracker_serial_number.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                    URL da Imagem (opcional)
                  </label>
                  <input
                    id="image"
                    type="url"
                    {...register('image', {
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: 'URL deve começar com http:// ou https://'
                      }
                    })}
                    placeholder="Ex: https://exemplo.com/imagem.jpg"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.image ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.image && (
                    <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Localização</h3>
              
              <div className="mb-6">
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  disabled={gettingLocation}
                  className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                    gettingLocation 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  {gettingLocation ? '📍 Obtendo localização...' : '📍 Usar minha localização atual'}
                </button>
                
                {useCurrentLocation && (
                  <span className="ml-4 text-green-600 font-medium">
                    ✅ Localização atual obtida
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude *
                  </label>
                  <input
                    id="latitude"
                    type="number"
                    step="any"
                    {...register('coordinates.latitude', {
                      required: 'Latitude é obrigatória',
                      min: {
                        value: -90,
                        message: 'Latitude deve estar entre -90 e 90'
                      },
                      max: {
                        value: 90,
                        message: 'Latitude deve estar entre -90 e 90'
                      }
                    })}
                    placeholder="Ex: -25.43247"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.coordinates?.latitude ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.coordinates?.latitude && (
                    <p className="mt-1 text-sm text-red-600">{errors.coordinates.latitude.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude *
                  </label>
                  <input
                    id="longitude"
                    type="number"
                    step="any"
                    {...register('coordinates.longitude', {
                      required: 'Longitude é obrigatória',
                      min: {
                        value: -180,
                        message: 'Longitude deve estar entre -180 e 180'
                      },
                      max: {
                        value: 180,
                        message: 'Longitude deve estar entre -180 e 180'
                      }
                    })}
                    placeholder="Ex: -49.27845"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.coordinates?.longitude ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.coordinates?.longitude && (
                    <p className="mt-1 text-sm text-red-600">{errors.coordinates.longitude.message}</p>
                  )}
                </div>
              </div>

              {watchedCoordinates.latitude && watchedCoordinates.longitude && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-blue-800">
                    <span className="font-medium">Coordenadas:</span> {watchedCoordinates.latitude}, {watchedCoordinates.longitude}
                  </p>
                </div>
              )}

              <div className="mt-6">
                <MapPicker
                  value={watchedCoordinates}
                  onChange={(coords) => {
                    setValue('coordinates.latitude', coords.latitude, { shouldValidate: true });
                    setValue('coordinates.longitude', coords.longitude, { shouldValidate: true });
                  }}
                  initialCenter={{ latitude: -25.4284, longitude: -49.2733 }}
                  height={360}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setUseCurrentLocation(false);
                  setSubmitError(null);
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                Limpar Formulário
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                } text-white`}
              >
                {isSubmitting ? 'Cadastrando...' : 'Cadastrar Veículo'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <a 
              href="/" 
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              ← Voltar para lista de veículos
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleRegister;
