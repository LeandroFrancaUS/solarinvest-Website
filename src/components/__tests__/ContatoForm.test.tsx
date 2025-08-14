import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ContatoForm from '../ContatoForm';

describe('ContatoForm', () => {
  it('submits form and resets fields on success', async () => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn(() => Promise.resolve({ ok: true })) as jest.Mock;

    render(<ContatoForm />);

    const nomeInput = screen.getByLabelText(/nome/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/e-mail/i) as HTMLInputElement;
    const mensagemInput = screen.getByLabelText(/mensagem/i) as HTMLTextAreaElement;
    const submitButton = screen.getByRole('button', { name: /enviar mensagem/i });

    await userEvent.type(nomeInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(mensagemInput, 'Hello');

    await userEvent.click(submitButton);

    expect(await screen.findByText(/obrigado pelo contato! responderemos em breve./i)).toBeInTheDocument();
    expect(nomeInput.value).toBe('');
    expect(emailInput.value).toBe('');
    expect(mensagemInput.value).toBe('');

    global.fetch = originalFetch;
  });
});
