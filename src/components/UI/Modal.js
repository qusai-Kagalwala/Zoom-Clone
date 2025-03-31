import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaTimes } from 'react-icons/fa';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease;
  backdrop-filter: blur(2px);
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: ${props => props.padding || '30px'};
  width: ${props => props.width || '90%'};
  max-width: ${props => props.maxWidth || '500px'};
  max-height: ${props => props.maxHeight || '90vh'};
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  animation: ${slideIn} 0.3s ease;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.noMargin ? '0' : '20px'};
  padding-bottom: ${props => props.noBorder ? '0' : '15px'};
  border-bottom: ${props => props.noBorder ? 'none' : '1px solid #eee'};
`;

const ModalTitle = styled.h3`
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f1f1f1;
    color: #343a40;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: ${props => props.align || 'flex-end'};
  gap: 10px;
  margin-top: ${props => props.noMargin ? '0' : '20px'};
  padding-top: ${props => props.noBorder ? '0' : '15px'};
  border-top: ${props => props.noBorder ? 'none' : '1px solid #eee'};
`;

/**
 * Reusable Modal Component
 * 
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Modal content
 * @param {string} props.title Modal title
 * @param {boolean} props.isOpen Whether the modal is visible
 * @param {function} props.onClose Function to close the modal
 * @param {string} props.width Width of the modal (CSS value)
 * @param {string} props.maxWidth Max width of the modal (CSS value)
 * @param {string} props.maxHeight Max height of the modal (CSS value)
 * @param {string} props.padding Padding of the modal content (CSS value)
 * @param {React.ReactNode} props.footer Footer content
 * @param {string} props.footerAlign Alignment of footer buttons ('flex-start', 'center', 'flex-end')
 * @param {boolean} props.hideCloseButton Whether to hide the close button
 * @param {boolean} props.noHeaderBorder Whether to hide the border below the header
 * @param {boolean} props.noFooterBorder Whether to hide the border above the footer
 * @param {boolean} props.noHeaderMargin Whether to remove margin below the header
 * @param {boolean} props.noFooterMargin Whether to remove margin above the footer
 * @param {boolean} props.closeOnOverlayClick Whether clicking the overlay closes the modal
 */
const Modal = ({
  children,
  title,
  isOpen,
  onClose,
  width,
  maxWidth,
  maxHeight,
  padding,
  footer,
  footerAlign,
  hideCloseButton = false,
  noHeaderBorder = false,
  noFooterBorder = false,
  noHeaderMargin = false,
  noFooterMargin = false,
  closeOnOverlayClick = true,
}) => {
  // Close modal on ESC key press
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent scrolling of body when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      // Restore scrolling when modal is closed
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent 
        width={width} 
        maxWidth={maxWidth} 
        maxHeight={maxHeight}
        padding={padding}
      >
        {title && (
          <ModalHeader noBorder={noHeaderBorder} noMargin={noHeaderMargin}>
            <ModalTitle>{title}</ModalTitle>
            {!hideCloseButton && (
              <CloseButton onClick={onClose}>
                <FaTimes />
              </CloseButton>
            )}
          </ModalHeader>
        )}
        
        <div>{children}</div>
        
        {footer && (
          <ModalFooter 
            align={footerAlign} 
            noBorder={noFooterBorder} 
            noMargin={noFooterMargin}
          >
            {footer}
          </ModalFooter>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;