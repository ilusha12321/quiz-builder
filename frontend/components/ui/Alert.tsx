import type { ReactNode } from 'react';

interface AlertProps {
  variant: 'error' | 'success';
  children: ReactNode;
  onDismiss?: () => void;
}

export function Alert({ variant, children, onDismiss }: AlertProps) {
  return (
    <div className={`alert alert-${variant}`} role={variant === 'error' ? 'alert' : 'status'}>
      <div className="alert-body">{children}</div>
      {onDismiss && (
        <button type="button" className="alert-close" onClick={onDismiss} aria-label="Dismiss">
          ×
        </button>
      )}
    </div>
  );
}
