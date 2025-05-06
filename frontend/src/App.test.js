import { render, screen } from '@testing-library/react';
import App from './App';

test('renders loading state initially', () => {
  render(<App />);
  // App starts with loggedIn===null, so it shows the loading message
  const loadingEl = screen.getByText(/please wait/i);
  expect(loadingEl).toBeInTheDocument();
});

