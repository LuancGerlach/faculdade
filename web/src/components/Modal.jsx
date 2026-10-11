import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

// Modal reutilizável e acessível: role=dialog, foco preso, ESC fecha, foco volta ao gatilho
export default function Modal({ isOpen, title, description, onClose, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previouslyFocusedElement = document.activeElement;
    const focusableElements = dialogRef.current.querySelectorAll(focusableSelector);
    focusableElements[0]?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const currentFocusable = [...dialogRef.current.querySelectorAll(focusableSelector)];
      const firstElement = currentFocusable[0];
      const lastElement = currentFocusable[currentFocusable.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previouslyFocusedElement?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? 'modal-description' : undefined}
      >
        <h2 id="modal-title">{title}</h2>
        {description && <p id="modal-description">{description}</p>}
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function ConfirmModal({
  isOpen, title, description, confirmLabel = 'Confirmar', isDanger = false, isLoading = false, onConfirm, onClose,
}) {
  return (
    <Modal isOpen={isOpen} title={title} description={description} onClose={onClose}>
      <div className="modal-actions">
        <button type="button" className="btn btn-ghost" onClick={onClose} disabled={isLoading}>Cancelar</button>
        <button type="button" className={`btn${isDanger ? ' btn-danger' : ''}`} onClick={onConfirm} disabled={isLoading}>
          {isLoading ? 'Aguarde...' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
