import { Spinner } from './Spinner'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="dialog-overlay" onClick={onCancel} role="dialog" aria-modal="true">
      <div className="dialog card" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="actions dialog-actions">
          <button className="button button-secondary" type="button" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </button>
          <button className="button button-danger" type="button" onClick={onConfirm} disabled={loading}>
            {loading && <Spinner />}
            {loading ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
