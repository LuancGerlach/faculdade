import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Icon from './Icon';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') ?? '');
  const { isAuthenticated, currentUser } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => setIsMenuOpen(false), [location.pathname]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmedSearch = searchTerm.trim();
    navigate(trimmedSearch ? `/catalogo?search=${encodeURIComponent(trimmedSearch)}` : '/catalogo');
  };

  const navLinkClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

  return (
    <header className="navbar">
      <nav className="container navbar-inner" aria-label="Navegação principal">
        <Link to="/" className="logo">
          CS2<span>MARKET</span><span className="visually-hidden"> página inicial</span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={isMenuOpen}
          aria-controls="main-menu"
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setIsMenuOpen((wasOpen) => !wasOpen)}
        >
          <Icon name={isMenuOpen ? 'close' : 'menu'} size={22} />
        </button>

        <form role="search" className="navbar-search" onSubmit={handleSearchSubmit}>
          <label htmlFor="navbar-search-input" className="visually-hidden">Buscar produtos</label>
          <Icon name="search" />
          <input
            id="navbar-search-input"
            type="search"
            placeholder="Buscar cursos, e-books, mapas..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </form>

        <div id="main-menu" className="navbar-links" data-open={isMenuOpen}>
          <NavLink to="/catalogo" className={navLinkClass}>Catálogo</NavLink>
          {isAuthenticated ? (
            <NavLink to="/minha-conta" className={navLinkClass}>
              Minha conta<span className="visually-hidden"> de {currentUser.name}</span>
            </NavLink>
          ) : (
            <NavLink to="/login" className={navLinkClass}>Entrar</NavLink>
          )}
          <NavLink to="/carrinho" className={navLinkClass}>
            Carrinho
            <span className="cart-count">{cartItems.length}<span className="visually-hidden"> itens</span></span>
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
