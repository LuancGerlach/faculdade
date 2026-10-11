import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import Icon from '../components/Icon';
import ProductCard from '../components/ProductCard';
import { EmptyState, ErrorState, LoadingState } from '../components/StateMessage';
import { useProducts } from '../hooks/useProducts';
import useDebouncedValue from '../hooks/useDebouncedValue';
import usePageTitle from '../hooks/usePageTitle';

const typeOptions = [
  { value: 'CURSO', label: 'Cursos' },
  { value: 'EBOOK', label: 'E-books' },
  { value: 'PACOTE', label: 'Pacotes' },
];
const mapOptions = ['Mirage', 'Inferno', 'Ancient', 'Nuke'];
const sortOptions = [
  { value: 'mais-vendidos', label: 'Mais vendidos' },
  { value: 'menor-preco', label: 'Menor preço' },
  { value: 'maior-preco', label: 'Maior preço' },
  { value: 'avaliacao', label: 'Melhor avaliação' },
];
const PRICE_LIMIT = 120;

const parseList = (rawValue) => (rawValue ? rawValue.split(',') : []);

export default function CatalogPage() {
  usePageTitle('Catálogo');
  const [searchParams, setSearchParams] = useSearchParams();
  const [areFiltersOpen, setAreFiltersOpen] = useState(false);

  const search = searchParams.get('search') ?? '';
  const selectedTypes = parseList(searchParams.get('type'));
  const selectedMaps = parseList(searchParams.get('map'));
  const sort = searchParams.get('sort') ?? 'mais-vendidos';
  const onlyTopRated = searchParams.get('minRating') === '4.5';
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get('maxPrice')) || PRICE_LIMIT);
  const debouncedMaxPrice = useDebouncedValue(maxPrice);

  const { products, isLoading, error, refetch } = useProducts({
    search: search || undefined,
    type: selectedTypes.join(',') || undefined,
    map: selectedMaps.join(',') || undefined,
    maxPrice: debouncedMaxPrice < PRICE_LIMIT ? debouncedMaxPrice : undefined,
    minRating: onlyTopRated ? 4.5 : undefined,
    sort,
  });

  const updateParam = (paramName, paramValue) => {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      if (paramValue) nextParams.set(paramName, paramValue);
      else nextParams.delete(paramName);
      return nextParams;
    }, { replace: true });
  };

  const toggleListValue = (paramName, currentValues, toggledValue) => {
    const nextValues = currentValues.includes(toggledValue)
      ? currentValues.filter((currentValue) => currentValue !== toggledValue)
      : [...currentValues, toggledValue];
    updateParam(paramName, nextValues.join(','));
  };

  const clearFilters = () => {
    setMaxPrice(PRICE_LIMIT);
    setSearchParams({}, { replace: true });
  };

  const hasActiveFilters = search || selectedTypes.length || selectedMaps.length || onlyTopRated || maxPrice < PRICE_LIMIT;

  return (
    <div className="container page">
      <Breadcrumb items={[{ label: 'Início', to: '/' }, { label: 'Catálogo' }]} />
      <h1 className="page-title">Catálogo</h1>

      <div className="catalog-layout">
        <div>
          <button
            type="button"
            className="btn btn-ghost btn-full filters-toggle"
            aria-expanded={areFiltersOpen}
            aria-controls="catalog-filters"
            onClick={() => setAreFiltersOpen((wereOpen) => !wereOpen)}
            style={{ marginBottom: 12 }}
          >
            <Icon name="filter" /> {areFiltersOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
          </button>

          <aside id="catalog-filters" className="filters" data-open={areFiltersOpen} aria-label="Filtros">
            <fieldset>
              <legend>Tipo</legend>
              {typeOptions.map((typeOption) => (
                <label key={typeOption.value} className="check-option">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(typeOption.value)}
                    onChange={() => toggleListValue('type', selectedTypes, typeOption.value)}
                  />
                  {typeOption.label}
                </label>
              ))}
            </fieldset>

            <fieldset>
              <legend>Mapa</legend>
              {mapOptions.map((mapName) => (
                <label key={mapName} className="check-option">
                  <input
                    type="checkbox"
                    checked={selectedMaps.includes(mapName)}
                    onChange={() => toggleListValue('map', selectedMaps, mapName)}
                  />
                  {mapName}
                </label>
              ))}
            </fieldset>

            <fieldset>
              <label htmlFor="max-price" className="filter-label">Preço máximo</label>
              <input
                id="max-price"
                type="range"
                className="range-input"
                min={20}
                max={PRICE_LIMIT}
                step={5}
                value={maxPrice}
                aria-valuetext={maxPrice < PRICE_LIMIT ? `Até R$ ${maxPrice}` : 'Sem limite'}
                onChange={(event) => {
                  const selectedPrice = Number(event.target.value);
                  setMaxPrice(selectedPrice);
                  updateParam('maxPrice', selectedPrice < PRICE_LIMIT ? String(selectedPrice) : '');
                }}
              />
              <div className="range-values" aria-hidden="true">
                <span>R$ 20</span>
                <span>{maxPrice < PRICE_LIMIT ? `até R$ ${maxPrice}` : 'sem limite'}</span>
              </div>
            </fieldset>

            <fieldset>
              <legend>Avaliação</legend>
              <label className="check-option">
                <input
                  type="checkbox"
                  checked={onlyTopRated}
                  onChange={() => updateParam('minRating', onlyTopRated ? '' : '4.5')}
                />
                4,5 estrelas ou mais
              </label>
            </fieldset>

            {hasActiveFilters && (
              <button type="button" className="btn btn-ghost btn-sm btn-full" onClick={clearFilters}>
                Limpar filtros
              </button>
            )}
          </aside>
        </div>

        <section aria-label="Resultados">
          <div className="catalog-toolbar">
            <p className="results-count" role="status" aria-live="polite">
              {isLoading ? 'Buscando...' : (
                <>
                  <strong>{products.length}</strong> {products.length === 1 ? 'resultado' : 'resultados'}
                  {search && <> para “{search}”</>}
                </>
              )}
            </p>
            <div>
              <label htmlFor="sort-select" className="visually-hidden">Ordenar por</label>
              <select
                id="sort-select"
                className="select"
                value={sort}
                onChange={(event) => updateParam('sort', event.target.value)}
              >
                {sortOptions.map((sortOption) => (
                  <option key={sortOption.value} value={sortOption.value}>Ordenar: {sortOption.label}</option>
                ))}
              </select>
            </div>
          </div>

          {error && <ErrorState message={error} onRetry={refetch} />}
          {!error && isLoading && <LoadingState label="Carregando produtos..." />}
          {!error && !isLoading && products.length === 0 && (
            <EmptyState title="Nenhum produto encontrado" message="Tente remover algum filtro ou buscar outro termo.">
              <button type="button" className="btn btn-ghost" onClick={clearFilters}>Limpar filtros</button>
            </EmptyState>
          )}
          {!error && !isLoading && products.length > 0 && (
            <div className="product-grid">
              {products.map((product) => <ProductCard key={product.id} product={product} headingLevel={2} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
