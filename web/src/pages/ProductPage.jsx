import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from '../components/Toast';
import Breadcrumb from '../components/Breadcrumb';
import Icon from '../components/Icon';
import StarRating from '../components/StarRating';
import { EmptyState, ErrorState, LoadingState } from '../components/StateMessage';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../context/CartContext';
import usePageTitle from '../hooks/usePageTitle';
import { formatCurrency, productTypeLabel } from '../utils/formatters';

function ModuleAccordion({ modules }) {
  const [openModuleIndex, setOpenModuleIndex] = useState(0);

  return (
    <div>
      {modules.map((productModule, moduleIndex) => {
        const isOpen = openModuleIndex === moduleIndex;
        const panelId = `module-panel-${moduleIndex}`;
        return (
          <div key={productModule.title} className="accordion-item">
            <h3>
              <button
                type="button"
                className="accordion-trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenModuleIndex(isOpen ? -1 : moduleIndex)}
              >
                {productModule.title}
                <span>{productModule.lessons.length} aulas · {productModule.duration}</span>
                <Icon name="chevron" />
              </button>
            </h3>
            <ul id={panelId} hidden={!isOpen}>
              {productModule.lessons.map((lesson) => (
                <li key={lesson.title} className="lesson-row">
                  <span>{lesson.title}</span><span>{lesson.duration}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export default function ProductPage() {
  const { productId } = useParams();
  const { product, isLoading, error, isNotFound, refetch } = useProduct(productId);
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();
  usePageTitle(product?.title ?? 'Produto');

  if (isLoading) return <div className="container page"><LoadingState label="Carregando produto..." /></div>;

  if (isNotFound) {
    return (
      <div className="container page">
        <EmptyState title="Produto não encontrado" message={error}>
          <Link to="/catalogo" className="btn">Ir para o catálogo</Link>
        </EmptyState>
      </div>
    );
  }

  if (error) return <div className="container page"><ErrorState message={error} onRetry={refetch} /></div>;

  const alreadyInCart = isInCart(product.id);
  const handleAddToCart = () => {
    addToCart(product);
    toast.success('Adicionado ao carrinho');
  };
  const handleBuyNow = () => {
    addToCart(product);
    navigate('/carrinho');
  };

  return (
    <>
      <div className="product-hero">
        <div className="container">
          <Breadcrumb items={[
            { label: 'Início', to: '/' },
            { label: 'Catálogo', to: '/catalogo' },
            { label: product.title },
          ]} />
          <p className="kicker">{productTypeLabel[product.type]} · {product.category}{product.map && ` · ${product.map}`}</p>
          <h1>{product.title}</h1>
          <div className="meta-line">
            <span><StarRating rating={product.rating} /> <strong>{product.rating.toFixed(1)}</strong> ({product.reviewsCount} avaliações)</span>
            {product.lessonsCount > 0 && <span><strong>{product.lessonsCount} aulas</strong></span>}
            <span>por <strong>{product.author}</strong></span>
          </div>
        </div>
      </div>

      <div className="container page product-layout">
        <div>
          <h2 className="section-title">Sobre</h2>
          <p className="product-description">{product.description}</p>
          {product.modules.length > 0 && (
            <>
              <h2 className="section-title">Conteúdo</h2>
              <ModuleAccordion modules={product.modules} />
            </>
          )}
        </div>

        <aside className="buy-card" aria-label="Compra">
          <div className="buy-card-media" aria-hidden="true">{productTypeLabel[product.type]}</div>
          <div className="price-box">
            <span className="price-big">{formatCurrency(product.price)}</span>
            {product.oldPrice && (
              <span className="price-old"><span className="visually-hidden">Preço anterior: </span>{formatCurrency(product.oldPrice)}</span>
            )}
          </div>
          <button type="button" className="btn btn-full" onClick={handleAddToCart} disabled={alreadyInCart}>
            {alreadyInCart ? 'Já está no carrinho' : 'Adicionar ao carrinho'}
          </button>
          <button type="button" className="btn btn-ghost btn-full" onClick={handleBuyNow}>Comprar agora</button>
          <ul className="benefits">
            <li>Acesso vitalício</li>
            <li>PDF com resumo</li>
            <li>Atualizações grátis</li>
          </ul>
          <div className="info-note"><strong>Entrega no e-mail:</strong> link de acesso enviado na hora após o pagamento.</div>
        </aside>
      </div>
    </>
  );
}
