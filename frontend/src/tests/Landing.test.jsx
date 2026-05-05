import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Landing from '../pages/Landing.jsx';
import store from '../app/store.js';

describe('Landing page', () => {
  it('shows CTA buttons', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Landing />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/Get started/i)).toBeInTheDocument();
  });
});
