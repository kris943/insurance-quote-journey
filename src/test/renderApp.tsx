import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '@/app/App';

export function renderApp() {
  const user = userEvent.setup();
  return { user, ...render(<App />) };
}
