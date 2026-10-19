import { screen, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { FAILURE_EMAIL } from '@/mocks/data';
import { server } from '@/mocks/server';
import { renderApp } from '@/test/renderApp';

type User = ReturnType<typeof renderApp>['user'];

const next = (user: User) => user.click(screen.getByRole('button', { name: /next|get quote/i }));

async function completeYourDetails(user: User, email = 'jane@example.com') {
  await screen.findByRole('heading', { name: 'Your Details' });
  await user.type(screen.getByLabelText('Email Address'), email);
  await user.type(screen.getByLabelText('Phone Number'), '0400 123 456');
  await next(user);
}

async function completeApplication(user: User, smoker: boolean) {
  await screen.findByRole('heading', { name: 'About You' });
  await user.selectOptions(
    screen.getByLabelText('What is your occupation?'),
    'Office / Professional',
  );
  await next(user);

  await screen.findByRole('heading', { name: 'Lifestyle' });
  await user.click(screen.getByRole('radio', { name: smoker ? 'Yes' : 'No' }));
  await next(user);
}

describe('insurance application journey', () => {
  it('validates required fields before allowing the customer to continue', async () => {
    const { user } = renderApp();
    await screen.findByRole('heading', { name: 'Your Details' });

    await next(user);

    expect(screen.getByText('Enter your email address')).toBeInTheDocument();
    expect(screen.getByText('Enter your phone number')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toHaveFocus();
    expect(screen.getByLabelText('Email Address')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('heading', { name: 'Your Details' })).toBeInTheDocument();
  });

  it('shows format errors on blur and clears them once corrected', async () => {
    const { user } = renderApp();
    await screen.findByRole('heading', { name: 'Your Details' });
    const email = screen.getByLabelText('Email Address');

    await user.type(email, 'not-an-email');
    await user.tab();
    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();

    await user.clear(email);
    await user.type(email, 'jane@example.com');
    expect(screen.queryByText('Enter a valid email address')).not.toBeInTheDocument();
  });

  it('returns a quote for a non-smoker', async () => {
    const { user } = renderApp();
    await completeYourDetails(user);
    await completeApplication(user, false);

    await screen.findByRole('heading', { name: 'Your Quote' });
    expect(screen.getByTestId('quote-premium')).toHaveTextContent('$64.85');
    expect(screen.getByText('$500,000')).toBeInTheDocument();
  });

  it('asks additional questions before quoting a smoker', async () => {
    const { user } = renderApp();
    await completeYourDetails(user);
    await completeApplication(user, true);

    await screen.findByRole('heading', { name: 'Smoking Details' });
    const nav = screen.getByRole('navigation', { name: 'Application progress' });
    expect(within(nav).getByRole('button', { name: /Smoking Details/ })).toHaveAttribute(
      'aria-current',
      'step',
    );

    await next(user);
    expect(screen.getByText('Enter the number of cigarettes per week')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/cigarettes do you smoke/i), '20');
    await next(user);

    await screen.findByRole('heading', { name: 'Your Quote' });
    expect(screen.getByTestId('quote-premium')).not.toHaveTextContent('$64.85');
  });

  it('lets the customer go back without losing answers', async () => {
    const { user } = renderApp();
    await completeYourDetails(user);
    await screen.findByRole('heading', { name: 'About You' });

    await user.click(screen.getByRole('button', { name: 'Back' }));

    await screen.findByRole('heading', { name: 'Your Details' });
    expect(screen.getByLabelText('Email Address')).toHaveValue('jane@example.com');
  });

  it('keeps the customer on the page and shows the error when quoting fails', async () => {
    const { user } = renderApp();
    await completeYourDetails(user, FAILURE_EMAIL);
    await completeApplication(user, false);

    expect(await screen.findByRole('alert')).toHaveTextContent(/temporarily unavailable/i);
    expect(screen.getByRole('heading', { name: 'Lifestyle' })).toBeInTheDocument();
  });

  it('recovers when the application fails to load', async () => {
    server.use(
      http.get('*/application', () => HttpResponse.json({}, { status: 500 }), { once: true }),
    );
    const { user } = renderApp();

    await screen.findByText("We couldn't load your application");
    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(await screen.findByRole('heading', { name: 'Your Details' })).toBeInTheDocument();
  });
});
