'use client';

import Link from 'next/link';
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

const navigationLinks = [
  { label: 'Início', href: '/' },
  { label: 'Como Funciona', href: '/comofunciona' },
  { label: 'Soluções', href: '/solucoes' },
  { label: 'Vídeos', href: '/videos' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'Contato', href: '/contato' },
];

const clientLinks = [
  { label: 'Manual de Limpeza', href: '/area-do-cliente/limpeza-modulos' },
  { label: 'Garantias', href: '/area-do-cliente/garantias' },
  { label: 'Manutenção Preventiva', href: '/area-do-cliente/planos' },
  { label: 'Inversores', href: '/area-do-cliente/inversores' },
  { label: 'Suporte Técnico', href: '/area-do-cliente/suporte' },
  { label: 'Planos de O&M', href: '/area-do-cliente/planos' },
];

const socialLinks = [
  {
    label: 'WhatsApp oficial SolarInvest',
    href: 'https://api.whatsapp.com/send/?phone=5562995150975&text=Ol%C3%A1%21+Gostaria+de+saber+mais+sobre+a+energia+solar+da+SolarInvest.&type=phone_number&app_absent=0',
    icon: FaWhatsapp,
    className: 'text-green-400 hover:text-green-300',
  },
  {
    label: 'Instagram oficial SolarInvest',
    href: 'https://www.instagram.com/solarinvest.br/',
    icon: FaInstagram,
    className: 'text-pink-400 hover:text-pink-300',
  },
  {
    label: 'Facebook oficial SolarInvest',
    href: 'https://www.facebook.com/SolarInvestSolutions',
    icon: FaFacebook,
    className: 'text-blue-500 hover:text-blue-400',
  },
  {
    label: 'LinkedIn oficial SolarInvest',
    href: 'https://www.linkedin.com/company/solarinvest-solutions',
    icon: FaLinkedin,
    className: 'text-blue-400 hover:text-blue-300',
  },
];

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-black uppercase tracking-[0.22em] text-orange-400">
      {children}
    </h2>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm text-slate-300 transition hover:text-orange-300">
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#0B1622] px-4 py-12 text-slate-300 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div className="space-y-5">
          <div>
            <p className="text-2xl font-black text-orange-500">SolarInvest</p>
            <p className="mt-1 text-sm font-semibold text-slate-400">
              da economia mensal ao patrimônio real
            </p>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-slate-400">
            Transformando economia mensal em patrimônio real através de soluções inteligentes de energia solar.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map(({ label, href, icon: Icon, className }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="me noopener noreferrer"
                aria-label={label}
                className={`${className} transition`}
              >
                <span className="sr-only">{label}</span>
                <Icon size={23} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <nav className="space-y-4" aria-label="Navegação do rodapé">
          <FooterHeading>Navegação</FooterHeading>
          <div className="flex flex-col gap-3">
            {navigationLinks.map((link) => (
              <FooterLink key={link.href} href={link.href}>
                {link.label}
              </FooterLink>
            ))}
          </div>
        </nav>

        <nav className="space-y-4" aria-label="Central do Cliente no rodapé">
          <FooterHeading>Central do Cliente</FooterHeading>
          <div className="flex flex-col gap-3">
            {clientLinks.map((link) => (
              <FooterLink key={`${link.href}-${link.label}`} href={link.href}>
                {link.label}
              </FooterLink>
            ))}
          </div>
        </nav>

        <div className="space-y-4">
          <FooterHeading>Contato</FooterHeading>
          <address className="not-italic text-sm leading-7 text-slate-400">
            <p>
              <span className="font-semibold text-slate-200">Telefone:</span> (62) 99515-0975
            </p>
            <p>
              <span className="font-semibold text-slate-200">WhatsApp:</span>{' '}
              <a
                href="https://api.whatsapp.com/send/?phone=5562995150975&text=Ol%C3%A1%21+Gostaria+de+saber+mais+sobre+a+energia+solar+da+SolarInvest.&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-orange-300"
              >
                (62) 99515-0975
              </a>
            </p>
            <p>
              <span className="font-semibold text-slate-200">E-mail:</span>{' '}
              <a href="mailto:contato@solarinvest.info" className="transition hover:text-orange-300">
                contato@solarinvest.info
              </a>
            </p>
            <p>
              <span className="font-semibold text-slate-200">Cidade/Estado:</span> Anápolis – GO
            </p>
          </address>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-slate-800 pt-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} SolarInvest. Todos os direitos reservados.
      </div>
    </footer>
  );
}
