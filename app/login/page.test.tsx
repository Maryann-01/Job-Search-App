import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '@/app/login/page';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('LoginPage', () => {
  const setupMocks = (
    user = null,
    loading = false,
    loginFn = jest.fn(),
    routerPush = jest.fn(),
    searchParamGet = jest.fn()
  ) => {
    (useRouter as jest.Mock).mockReturnValue({
      push: routerPush,
    });

    (useSearchParams as jest.Mock).mockReturnValue({
      get: searchParamGet,
    });

    (useAuth as jest.Mock).mockReturnValue({
      user,
      loading,
      login: loginFn,
      logout: jest.fn(),
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login button when not logged in', () => {
    setupMocks();
    render(<LoginPage />);
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
  });

  test('redirects to home when user is already logged in', async () => {
    const routerPush = jest.fn();
    setupMocks({ uid: '123', email: 'test@example.com' } as any, false, jest.fn(), routerPush);
    
    render(<LoginPage />);
    
    await waitFor(() => {
      expect(routerPush).toHaveBeenCalledWith('/');
    });
  });

  test('redirects to specified redirect URL when user is already logged in', async () => {
    const routerPush = jest.fn();
    const searchParamGet = jest.fn().mockReturnValue('/jobs/123');
    
    setupMocks({ uid: '123', email: 'test@example.com' } as any, false, jest.fn(), routerPush, searchParamGet);
    
    render(<LoginPage />);
    
    await waitFor(() => {
      expect(searchParamGet).toHaveBeenCalledWith('redirect');
      expect(routerPush).toHaveBeenCalledWith('/jobs/123');
    });
  });

  test('calls login function when button is clicked', async () => {
    const loginFn = jest.fn();
    setupMocks(null, false, loginFn);
    
    render(<LoginPage />);
    
    fireEvent.click(screen.getByText('Continue with Google'));
    
    expect(loginFn).toHaveBeenCalled();
  });

  test('displays error message from URL', () => {
    const searchParamGet = jest.fn()
      .mockImplementation((param) => {
        if (param === 'error') return 'Something%20went%20wrong';
        return null;
      });
    
    setupMocks(null, false, jest.fn(), jest.fn(), searchParamGet);
    
    render(<LoginPage />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  test('shows loading state when auth is loading', () => {
    setupMocks(null, true);
    
    render(<LoginPage />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});