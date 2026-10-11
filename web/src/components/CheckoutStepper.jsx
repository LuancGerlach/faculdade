const checkoutSteps = ['Carrinho', 'Pagamento', 'Confirmação'];

export default function CheckoutStepper({ currentStep }) {
  return (
    <ol className="stepper" aria-label="Etapas da compra">
      {checkoutSteps.map((stepLabel, stepIndex) => {
        const stepNumber = stepIndex + 1;
        const stepState = stepNumber < currentStep ? 'done' : stepNumber === currentStep ? 'current' : 'pending';
        return (
          <li key={stepLabel} style={{ display: 'contents' }}>
            <span className={`step ${stepState}`} aria-current={stepState === 'current' ? 'step' : undefined}>
              <span className="step-number" aria-hidden="true">{stepState === 'done' ? '✓' : stepNumber}</span>
              {stepLabel}
              {stepState === 'done' && <span className="visually-hidden"> (concluída)</span>}
            </span>
            {stepNumber < checkoutSteps.length && <span className="step-bar" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}
