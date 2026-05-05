import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icons, Icon } from '../../utils/icons.jsx';

const Modal = ({ title, children, isOpen, onClose, footer }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  console.log('Modal: Rendering with Portal to document.body');
  console.log('Modal: Title:', title);
  console.log('Modal: Has children:', !!children);
  console.log('Modal: Children type:', typeof children);

  // Render modal at document root using Portal
  const modalContent = (
    <div 
      onClick={onClose}
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '512px',
          maxHeight: '90vh',
          overflow: 'auto',
          border: '2px solid rgba(255, 255, 255, 0.4)',
          position: 'relative',
          zIndex: 100000
        }}
      >
        {/* Header */}
        <div style={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '2px solid rgb(233, 213, 255)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(236, 72, 153), rgb(249, 115, 22))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Icon icon={Icons.sparklesSolid} size="md" className="text-purple-500" />
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgb(243, 232, 255)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            aria-label="Close modal"
          >
            <Icon icon={Icons.xMark} size="lg" className="text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            position: 'sticky',
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            borderTop: '2px solid rgb(233, 213, 255)',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px'
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
