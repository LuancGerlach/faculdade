import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';

export default function Layout() {
  const mainRef = useRef(null);
  const location = useLocation();

  // Ao trocar de página, leva o foco ao conteúdo (leitores de tela anunciam a nova página)
  useEffect(() => {
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [location.pathname]);

  return (
    <>
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <Navbar />
      <main id="conteudo" ref={mainRef} tabIndex={-1} style={{ outline: 'none' }}>
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container">CS2 Market · Projeto acadêmico de Programação para Interface de Usuário · UNIJUÍ</div>
      </footer>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: '#1C1F24', color: '#F4F6F9', border: '1px solid #33383F', fontFamily: 'Inter, sans-serif' },
          success: { iconTheme: { primary: '#4FB477', secondary: '#0C0D10' } },
          error: { iconTheme: { primary: '#FF6B6F', secondary: '#0C0D10' } },
        }}
      />
    </>
  );
}
