import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navigation from '../../components/Navigation';

const renderWithRouter = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Navigation />
    </MemoryRouter>
  );
};

describe('Navigation', () => {
  it('should render navigation brand', () => {
    renderWithRouter();
    
    expect(screen.getByText('🚗 Vehicle Manager')).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    renderWithRouter();
    
    expect(screen.getByText('📋 Lista de Veículos')).toBeInTheDocument();
    expect(screen.getByText('➕ Cadastrar Veículo')).toBeInTheDocument();
  });

  it('should have correct link hrefs', () => {
    renderWithRouter();
    
    const listLink = screen.getByText('📋 Lista de Veículos').closest('a');
    const registerLink = screen.getByText('➕ Cadastrar Veículo').closest('a');
    
    expect(listLink).toHaveAttribute('href', '/');
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  it('should highlight active link for home page', () => {
    renderWithRouter('/');
    
    const listLink = screen.getByText('📋 Lista de Veículos').closest('a');
    const registerLink = screen.getByText('➕ Cadastrar Veículo').closest('a');
    
    expect(listLink).toHaveClass('active');
    expect(registerLink).not.toHaveClass('active');
  });

  it('should highlight active link for register page', () => {
    renderWithRouter('/register');
    
    const listLink = screen.getByText('📋 Lista de Veículos').closest('a');
    const registerLink = screen.getByText('➕ Cadastrar Veículo').closest('a');
    
    expect(listLink).not.toHaveClass('active');
    expect(registerLink).toHaveClass('active');
  });

  it('should have nav-link class on all links', () => {
    renderWithRouter();
    
    const listLink = screen.getByText('📋 Lista de Veículos').closest('a');
    const registerLink = screen.getByText('➕ Cadastrar Veículo').closest('a');
    
    expect(listLink).toHaveClass('nav-link');
    expect(registerLink).toHaveClass('nav-link');
  });

  it('should render with correct structure', () => {
    renderWithRouter();
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('navigation');
    
    const container = nav.querySelector('.nav-container');
    expect(container).toBeInTheDocument();
    
    const brand = container?.querySelector('.nav-brand');
    expect(brand).toBeInTheDocument();
    
    const links = container?.querySelector('.nav-links');
    expect(links).toBeInTheDocument();
  });
});
