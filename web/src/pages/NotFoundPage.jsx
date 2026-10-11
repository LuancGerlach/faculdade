import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';

export default function NotFoundPage() {
  usePageTitle('Página não encontrada');
  return (
    <div className="container page">
      <div className="state-box">
        <h1 className="page-title">404 · Página não encontrada</h1>
        <p>O endereço acessado não existe ou foi removido.</p>
        <Link to="/" className="btn">Voltar ao início</Link>
      </div>
    </div>
  );
}
