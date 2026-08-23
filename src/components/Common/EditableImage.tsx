import React, { useState } from 'react';
import { Camera, Globe, Sparkles, Upload, Search } from 'lucide-react';
import { PhotoChangerModal } from '../Modals/PhotoChangerModal';
import { STORAGE_FOLDERS } from '../../lib/firebase';

interface EditableImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  isAdmin?: boolean;
  itemTitle?: string;
  modalTitle?: string;
  storageFolder?: string;
  onSavePhoto?: (newUrl: string) => void;
  onAddToast?: (title: string, description?: string, type?: 'success' | 'info') => void;
  onClick?: () => void;
  buttonPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
  buttonLabel?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  loading?: 'lazy' | 'eager';
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = '',
  isAdmin = false,
  itemTitle = '',
  modalTitle = 'Ganti / Edit Foto',
  storageFolder = STORAGE_FOLDERS.GALLERY_IMAGES,
  onSavePhoto,
  onAddToast = () => {},
  onClick,
  buttonPosition = 'top-right',
  buttonLabel = 'Ganti / Cari Foto',
  referrerPolicy = 'no-referrer',
  loading,
  onError
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If not admin / not teacher mode, render completely standard clean image
  if (!isAdmin || !onSavePhoto) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        referrerPolicy={referrerPolicy}
        loading={loading}
        onError={onError}
        onClick={onClick}
      />
    );
  }

  // Positioning classes for the edit action button
  const positionClasses = {
    'top-right': 'top-2.5 right-2.5',
    'top-left': 'top-2.5 left-2.5',
    'bottom-right': 'bottom-2.5 right-2.5',
    'bottom-left': 'bottom-2.5 left-2.5',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  }[buttonPosition];

  return (
    <div className={`relative group/img ${containerClassName || 'w-full h-full'}`}>
      <img
        src={src}
        alt={alt}
        className={className}
        referrerPolicy={referrerPolicy}
        loading={loading}
        onError={onError}
        onClick={onClick}
      />

      {/* Teacher / Admin Edit Overlay Button */}
      <div className={`absolute ${positionClasses} z-30 pointer-events-auto`}>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-[#0284C7] text-[#0284C7] hover:text-white border border-[#BAE6FD] hover:border-[#0284C7] shadow-md hover:shadow-lg backdrop-blur-md text-[11px] font-bold transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95 group/btn"
          title={`Edit Foto, Unggah dari Perangkat, atau Cari via Google: ${itemTitle}`}
        >
          <Camera className="w-3.5 h-3.5 text-[#0284C7] group-hover/btn:text-white transition-colors shrink-0" />
          <span className="hidden sm:inline whitespace-nowrap">{buttonLabel}</span>
          <Globe className="w-3 h-3 text-[#38BDF8] group-hover/btn:text-white/90 hidden sm:inline" />
        </button>
      </div>

      {/* Photo Changer Modal for Teacher */}
      <PhotoChangerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentImageUrl={src}
        itemTitle={itemTitle}
        modalTitle={modalTitle}
        storageFolder={storageFolder}
        onSavePhoto={(newUrl) => {
          if (onSavePhoto) {
            onSavePhoto(newUrl);
          }
        }}
        onAddToast={onAddToast}
      />
    </div>
  );
};
