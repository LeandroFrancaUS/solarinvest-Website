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
    const consumoInput = screen.getByLabelText(/consumo médio de energia/i) as HTMLInputElement;
    const municipioInput = screen.getByLabelText(/município para instalação/i) as HTMLInputElement;
    const estadoInput = screen.getByLabelText(/estado \(uf\)/i) as HTMLInputElement;
    const whatsappInput = screen.getByLabelText(/whatsapp/i) as HTMLInputElement;
    const mensagemInput = screen.getByLabelText(/mensagem/i) as HTMLTextAreaElement;
    const submitButton = screen.getByRole('button', { name: /enviar mensagem/i });

    await userEvent.type(nomeInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(consumoInput, '500 kWh');
    await userEvent.type(municipioInput, 'porto alegre');
    await userEvent.type(estadoInput, 'rs');
    await userEvent.type(whatsappInput, '(51) 99999-8888');
    await userEvent.type(mensagemInput, 'Hello');

    await userEvent.click(submitButton);

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/contato',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: 'John Doe',
          email: 'john@example.com',
          consumo: '500 kWh',
          municipio: 'Porto Alegre',
          estado: 'RS',
          whatsapp: '51999998888',
          mensagem: 'Hello',
        }),
      })
    );

    expect(await screen.findByText(/obrigado pelo contato! responderemos em breve./i)).toBeInTheDocument();
    expect(nomeInput.value).toBe('');
    expect(emailInput.value).toBe('');
    expect(consumoInput.value).toBe('');
    expect(municipioInput.value).toBe('');
    expect(estadoInput.value).toBe('');
    expect(whatsappInput.value).toBe('');
    expect(mensagemInput.value).toBe('');

    global.fetch = originalFetch;
  });
});
