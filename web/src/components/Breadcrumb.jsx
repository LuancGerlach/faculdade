import { Link } from 'react-router-dom';

export default function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb" aria-label="Você está em">
      <ol>
        {items.map((breadcrumbItem, itemIndex) => {
          const isLastItem = itemIndex === items.length - 1;
          return (
            <li key={breadcrumbItem.label}>
              {isLastItem || !breadcrumbItem.to
                ? <span aria-current={isLastItem ? 'page' : undefined}>{breadcrumbItem.label}</span>
                : <Link to={breadcrumbItem.to}>{breadcrumbItem.label}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
