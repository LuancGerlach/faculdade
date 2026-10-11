import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import FormField from '../components/FormField';
import { login } from '../api/userApi';
import { applyServerErrors } from '../hooks/useServerFieldErrors';
import { useAuth } from '../context/AuthContext';
import { loginSchema } from '../validation/userSchemas';
import usePageTitle from '../hooks/usePageTitle';

export default function LoginPage() {
  usePageTitle('Entrar');
  const [formAlert, setFormAlert] = useState(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/minha-conta';

  const {
    register, handleSubmit, setError, formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' }, mode: 'onTouched' });

  const onSubmit = async (credentials) => {
    setFormAlert(null);
    try {
      const response = await login(credentials);
      signIn(response.data);
      toast.success(`Bem-vindo, ${response.data.name.split(' ')[0]}!`);
      navigate(redirectPath);
    } catch (requestError) {
      const generalMessage = applyServerErrors(requestError, setError);
      if (generalMessage) setFormAlert(generalMessage);
    }
  };

  return (
    <div className="container page">
      <div className="auth-wrap">
        <h1 className="page-title">Entrar</h1>
        <p className="auth-subtitle">Acesse suas compras e continue de onde parou.</p>

        <form className="panel" onSubmit={handleSubmit(onSubmit)} noValidate>
          {formAlert && <div className="form-alert" role="alert">{formAlert}</div>}
          <FormField id="login-email" label="E-mail" type="email" required autoComplete="email" error={errors.email?.message} {...register('email')} />
          <FormField id="login-password" label="Senha" type="password" required autoComplete="current-password" error={errors.password?.message} {...register('password')} />
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
