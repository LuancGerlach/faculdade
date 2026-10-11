// Estados reutilizáveis de requisição: carregando, erro (com nova tentativa) e vazio
export function LoadingState({ label = 'Carregando...' }) {
  return (
    <div className="state-box" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorState({ title = 'Não foi possível carregar', message, onRetry }) {
  return (
    <div className="state-box error" role="alert">
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {onRetry && <button type="button" className="btn btn-ghost" onClick={onRetry}>Tentar novamente</button>}
    </div>
  );
}

export function EmptyState({ title, message, children }) {
  return (
    <div className="state-box">
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {children}
    </div>
  );
}
