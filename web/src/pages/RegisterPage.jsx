import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import FormField from '../components/FormField';
import { toast } from '../components/Toast';
import { createUser } from '../api/userApi';
import { applyServerErrors } from '../api/errorHandler';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { validateRegister } from '../validation/userValidation';
import { formatCpf } from '../utils/formatters';
import usePageTitle from '../hooks/usePageTitle';

const initialValues = { name: '', email: '', cpf: '', password: '', confirmPassword: '', acceptedTerms: false };

export default function RegisterPage() {
  usePageTitle('Criar conta');
  const [formAlert, setFormAlert] = useState(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/minha-conta';

  const { values, errors, isSubmitting, fieldProps, setFieldValue, handleSubmit } = useForm({
    initialValues,
    validate: validateRegister,
    onSubmit: async (formValues, { setFieldErrors }) => {
      setFormAlert(null);
      try {
        const createdUser = await createUser(formValues);
        signIn(createdUser);
        toast.success('Conta criada! Suas compras chegam neste e-mail.');
        navigate(redirectPath);
      } catch (requestError) {
        setFormAlert(applyServerErrors(requestError, setFieldErrors));
      }
    },
  });

  return (
    <div className="container page">
      <div className="auth-wrap">
        <h1 className="page-title">Criar conta</h1>
        <p className="auth-subtitle">Seus conteúdos chegam no e-mail cadastrado.</p>

        <form className="panel" onSubmit={handleSubmit} noValidate aria-describedby="required-note">
          <p id="required-note" className="field-hint" style={{ marginTop: 0, marginBottom: 14 }}>
            Campos com <span className="required-mark">*</span> são obrigatórios.
          </p>
          {formAlert && <div className="form-alert" role="alert">{formAlert}</div>}

          <FormField id="name" label="Nome completo" required autoComplete="name" {...fieldProps('name')} />
          <FormField
            id="email" label="E-mail (usado para entrega)" type="email" required autoComplete="email"
            hint="É aqui que você recebe as compras." {...fieldProps('email')}
          />
          <FormField
            id="cpf" label="CPF" required inputMode="numeric" autoComplete="off" placeholder="000.000.000-00"
            {...fieldProps('cpf')}
            onChange={(event) => setFieldValue('cpf', formatCpf(event.target.value))}
          />
          <div className="two-columns">
            <FormField
              id="password" label="Senha" type="password" required autoComplete="new-password"
              hint="Mínimo 8 caracteres, com letra e número." {...fieldProps('password')}
            />
            <FormField
              id="confirmPassword" label="Confirmar senha" type="password" required autoComplete="new-password"
              {...fieldProps('confirmPassword')}
            />
          </div>

          <div className="field">
            <label className="check-row" htmlFor="acceptedTerms">
              <input
                id="acceptedTerms" name="acceptedTerms" type="checkbox"
                checked={values.acceptedTerms}
                onChange={fieldProps('acceptedTerms').onChange}
                onBlur={fieldProps('acceptedTerms').onBlur}
                aria-invalid={errors.acceptedTerms ? 'true' : 'false'}
                aria-describedby={errors.acceptedTerms ? 'acceptedTerms-error' : undefined}
              />
              <span>Aceito os termos de uso e a política de privacidade.<span className="required-mark" aria-hidden="true">*</span></span>
            </label>
            {errors.acceptedTerms && (
              <p id="acceptedTerms-error" className="field-error" role="alert">{errors.acceptedTerms}</p>
            )}
          </div>

          <button type="submit" className="btn btn-full" disabled={isSubmitting}>
            {isSubmitting ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="auth-footer">Já tem conta? <Link to={`/login?redirect=${encodeURIComponent(redirectPath)}`}>Entrar</Link></p>
      </div>
    </div>
  );
}
