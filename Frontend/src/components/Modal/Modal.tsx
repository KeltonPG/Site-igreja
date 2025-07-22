import ReactDOM from 'react-dom'
import './Modal.scss'

interface ModalProps {
  aberto: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function Modal({ aberto, onClose, children }: ModalProps) {
  if (!aberto) return null

  return ReactDOM.createPortal(
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{ zIndex: 99999, position: 'fixed', top: 0, left: 0 }}
    >
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ zIndex: 100000, position: 'relative' }}
      >
        {children}
      </div>
    </div>,
    document.body
  )
} 