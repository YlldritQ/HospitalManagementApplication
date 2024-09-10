import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { RoomDto, CURoomDto } from '../../types/roomTypes';

interface RoomEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: RoomDto | null;
  onUpdate: (roomDto: CURoomDto) => void;
  onCreate: (roomDto: CURoomDto) => void;
}

const RoomEditModal: React.FC<RoomEditModalProps> = ({ isOpen, onClose, room, onUpdate, onCreate }) => {
  const [roomNumber, setRoomNumber] = useState('');
  const [isOccupied, setIsOccupied] = useState(false);
  const [departmentId, setDepartmentId] = useState<number | ''>('');

  useEffect(() => {
    if (room) {
      setRoomNumber(room.roomNumber);
      setIsOccupied(room.isOccupied);
      setDepartmentId(room.departmentId);
    } else {
      setRoomNumber('');
      setIsOccupied(false);
      setDepartmentId('');
    }
  }, [room]);

  const handleSave = () => {
    const roomDto: CURoomDto = { roomNumber, isOccupied, departmentId: Number(departmentId) };
    if (room) {
      onUpdate(roomDto);
    } else {
      onCreate(roomDto);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} ariaHideApp={false}>
      <h2>{room ? 'Edit Room' : 'Create Room'}</h2>
      <div>
        <label>
          Room Number:
          <input 
            type="text" 
            value={roomNumber} 
            onChange={(e) => setRoomNumber(e.target.value)} 
          />
        </label>
        <label>
          Is Occupied:
          <input 
            type="checkbox" 
            checked={isOccupied} 
            onChange={(e) => setIsOccupied(e.target.checked)} 
          />
        </label>
        <label>
          Department ID:
          <input 
            type="number" 
            value={departmentId} 
            onChange={(e) => setDepartmentId(Number (e.target.value))} 
          />
        </label>
        <button onClick={handleSave}>{room ? 'Update Room' : 'Create Room'}</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
};

export default RoomEditModal;
