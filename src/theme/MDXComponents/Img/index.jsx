import React, {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import OriginalImg from '@theme-original/MDXComponents/Img';
import {X, ZoomIn} from 'lucide-react';

function ImagePreview({src, alt, onClose}) {
  const dialog = useRef(null);
  useEffect(() => { dialog.current.showModal(); }, []);
  return createPortal(
    <dialog ref={dialog} className="image-dialog" aria-label={alt || 'Podgląd ilustracji'} onClose={onClose}
      onClick={event => { if (event.target === event.currentTarget) dialog.current.close(); }}>
      <button type="button" className="dialog-close" onClick={() => dialog.current.close()} aria-label="Zamknij podgląd obrazu"><X size={22}/></button>
      <img src={src} alt={alt}/>
      <p><a href={src} target="_blank" rel="noopener noreferrer">Otwórz obraz w pełnym rozmiarze</a></p>
    </dialog>, document.body,
  );
}

export default function MDXImg(props) {
  const [open, setOpen] = useState(false);
  return <span className="markdown-image">
    <button type="button" className="markdown-image-trigger" aria-label={`Powiększ: ${props.alt || 'ilustracja'}`} onClick={() => setOpen(true)}>
      <OriginalImg {...props}/><span><ZoomIn size={16}/> Powiększ</span>
    </button>
    {open && <ImagePreview src={props.src} alt={props.alt} onClose={() => setOpen(false)}/>}
  </span>;
}
