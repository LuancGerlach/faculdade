import { Link } from 'react-router-dom';
import { toast } from './Toast';
import StarRating from './StarRating';
import { useCart } from '../context/CartContext';
import { formatCurrency, productTypeLabel } from '../utils/formatters';

export default function ProductCard({ product, headingLevel = 3 }) {
  const { addToCart, isInCart } = useCart();
  const alreadyInCart = isInCart(product.id);
  const HeadingTag = `h${headingLevel}`;

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.title} adicionado ao carrinho`);
  };

  return (
    <article className="card">
      <div className="card-thumb">
        {product.badge && (
          <span className={`badge${product.badge === 'TOP' ? ' badge-hot' : ''}`}>
            {product.badge === 'TOP' ? 'Top' : 'Novo'}
          </span>
        )}
        <span className="thumb-label" aria-hidden="true">{productTypeLabel[product.type]}</span>
      </div>
      <div className="card-body">
        <p className="card-category">{productTypeLabel[product.type]} · {product.category}</p>
        <HeadingTag className="card-title">
          <Link to={`/produto/${product.id}`}>{product.title}</Link>
        </HeadingTag>
        <div className="card-footer">
          <span className="price">
            <span className="visually-hidden">Preço: </span>{formatCurrency(product.price)}
          </span>
          <StarRating rating={product.rating} />
        </div>
      </div>
      <div className="card-actions">
        <button
          type="button"
          className={`btn btn-sm btn-full${alreadyInCart ? ' btn-ghost' : ''}`}
          onClick={handleAddToCart}
          disabled={alreadyInCart}
          aria-label={alreadyInCart ? `${product.title} já está no carrinho` : `Adicionar ${product.title} ao carrinho`}
        >
          {alreadyInCart ? 'No carrinho' : 'Adicionar'}
        </button>
      </div>
    </article>
  );
}
