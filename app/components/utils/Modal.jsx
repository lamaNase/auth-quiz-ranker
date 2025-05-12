function Modal({ children, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <dialog className="modal" open onClick={e => e.stopPropagation()}>
        {children}
      </dialog>
    </div>
  );
}

export default Modal;