import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  contentLabel: string;
  children: React.ReactNode;
}

const CustomModal: React.FC<ModalProps> = ({ isOpen, onRequestClose, contentLabel, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={contentLabel}
      className="modal"
      overlayClassName="overlay"
    >
      <button onClick={onRequestClose} className="absolute top-2 right-2 bg-gray-300 p-2 rounded">
        Close
      </button>
      {children}
    </Modal>
  );
};

export default CustomModal;
