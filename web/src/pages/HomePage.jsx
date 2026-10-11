import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { EmptyState, ErrorState } from '../components/StateMessage';
import { useProducts } from '../hooks/useProducts';
import usePageTitle from '../hooks/usePageTitle';

const categoryChips = [
  { label: 'Todos', filter: {} },
  { label: 'Cursos', filter: { type: 'CURSO' } },
  { label: 'E-books', filter: { type: 'EBOOK' } },
  { label: 'Pacotes', filter: { type: 'PACOTE' } },
  { label: 'Granadas', filter: { search: 'Granadas' } },
  { label: 'Aim', filter: { search: 'Aim' } },
  { label: 'Economia', filter: { search: 'Economia' } },
];

export default function HomePage() {
  usePageTitle();
  const [selectedChip, setSelectedChip] = useState(categoryChips[0]);
  const { products, isLoading, error, refetch } = useProducts({ ...selectedChip.filter, sort: 'mais-vendidos' });
  const topProducts = products.slice(0, 6);

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="container">
          <p className="kicker">Conteúdo de jogadores de alto nível</p>
          <h1 id="hero-title">Domine o <span>utility</span></h1>
          <p>Cursos de táticas, e-books de granadas e guias de economia. Compra entregue na hora, direto no seu e-mail.</p>
          <div className="hero-actions">
            <Link to="/catalogo" className="btn">Explorar catálogo</Link>
            <Link to="/catalogo?sort=avaliacao" className="btn btn-ghost">Mais bem avaliados</Link>
          </div>
        </div>
      </section>

      <section className="container page" aria-labelledby="top-sellers-title">
        <div className="chip-group" role="group" aria-label="Filtrar por categoria" style={{ marginBottom: 22 }}>
          {categoryChips.map((categoryChip) => (
            <button
              key={categoryChip.label}
              type="button"
              className="chip"
              aria-pressed={selectedChip.label === categoryChip.label}
              onClick={() => setSelectedChip(categoryChip)}
            >
              {categoryChip.label}
            </button>
          ))}
        </div>

        <div className="catalog-toolbar">
          <h2 id="top-sellers-title" className="section-title">Mais vendidos</h2>
          <Link to="/catalogo" className="nav-link">Ver todos ›</Link>
        </div>

        {error && <ErrorState message={error} onRetry={refetch} />}
        {!error && isLoading && (
          <div className="product-grid" aria-busy="true" aria-label="Carregando produtos">
            {Array.from({ length: 6 }, (_, skeletonIndex) => <div key={skeletonIndex} className="skeleton" />)}
          </div>
        )}
        {!error && !isLoading && topProducts.length === 0 && (
          <EmptyState title="Nada por aqui" message="Nenhum produto nesta categoria." />
        )}
        {!error && !isLoading && topProducts.length > 0 && (
          <div className="product-grid">
            {topProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </section>
    </>
  );
}
