import { Link, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { ToastContainer } from './Toast';
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
        <div className="container">
          CS2 Market · Projeto acadêmico de Programação para Interface de Usuário · UNIJUÍ
          {' · '}
          <Link to="/termos">Termos de uso</Link>
        </div>
      </footer>
      <ToastContainer />
    </>
  );
}
