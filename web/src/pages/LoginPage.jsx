import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import FormField from '../components/FormField';
import { toast } from '../components/Toast';
import { login } from '../api/userApi';
import { applyServerErrors } from '../api/errorHandler';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { validateLogin } from '../validation/userValidation';
import usePageTitle from '../hooks/usePageTitle';

export default function LoginPage() {
  usePageTitle('Entrar');
  const [formAlert, setFormAlert] = useState(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/minha-conta';

  const { isSubmitting, fieldProps, handleSubmit } = useForm({
    initialValues: { email: '', password: '' },
    validate: validateLogin,
    onSubmit: async (credentials, { setFieldErrors }) => {
      setFormAlert(null);
      try {
        const authenticatedUser = await login(credentials);
        signIn(authenticatedUser);
        toast.success(`Bem-vindo, ${authenticatedUser.name.split(' ')[0]}!`);
        navigate(redirectPath);
      } catch (requestError) {
        setFormAlert(applyServerErrors(requestError, setFieldErrors));
      }
    },
  });

  return (
    <div className="container page">
      <div className="auth-wrap">
        <h1 className="page-title">Entrar</h1>
        <p className="auth-subtitle">Acesse suas compras e continue de onde parou.</p>

        <form className="panel" onSubmit={handleSubmit} noValidate>
          {formAlert && <div className="form-alert" role="alert">{formAlert}</div>}
          <FormField id="login-email" label="E-mail" type="email" required autoComplete="email" {...fieldProps('email')} />
          <FormField id="login-password" label="Senha" type="password" required autoComplete="current-password" {...fieldProps('password')} />
          <button type="submit" className="btn btn-full" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-footer">
          Não tem conta? <Link to={`/cadastro?redirect=${encodeURIComponent(redirectPath)}`}>Criar conta grátis</Link>
        </p>
      </div>
    </div>
  );
}
