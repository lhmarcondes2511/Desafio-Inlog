import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the VehicleContext to avoid complex dependencies
jest.mock('./contexts/VehicleContext', () => ({
  VehicleProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useVehicles: () => ({
    vehicles: [],
    loading: false,
    error: null,
    addVehicle: jest.fn(),
    updateVehicle: jest.fn(),
    deleteVehicle: jest.fn(),
    loadVehicles: jest.fn()
  })
}));

// Mock the pages to avoid complex rendering issues
jest.mock('./pages/VehicleList', () => {
  return function MockVehicleList() {
    return <div>Lista de Veículos</div>;
  };
});

jest.mock('./pages/VehicleRegister', () => {
  return function MockVehicleRegister() {
    return <div>Cadastro de Veículo</div>;
  };
});

const renderApp = () => {
  return render(
    <App />
  );
};

test('renders vehicle manager app', () => {
  renderApp();
  expect(screen.getByText('🚗 Vehicle Manager')).toBeInTheDocument();
});

test('renders navigation links', () => {
  renderApp();
  expect(screen.getByText('📋 Lista de Veículos')).toBeInTheDocument();
  expect(screen.getByText('➕ Cadastrar Veículo')).toBeInTheDocument();
});

test('renders vehicle list page by default', () => {
  renderApp();
  expect(screen.getByText('Lista de Veículos')).toBeInTheDocument();
});
