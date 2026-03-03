import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import './TrailerModal.css';

const TrailerModal = ({ trailerKey, onClose }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div className="trailer-modal" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="trailer-modal__content">
        <button className="trailer-modal__close" onClick={onClose} aria-label="Close trailer">
          <X size={20} />
        </button>
        <div className="trailer-modal__frame-wrap">
          <iframe
            className="trailer-modal__iframe"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
            title="Movie Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
