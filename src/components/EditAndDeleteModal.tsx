import React from 'react';
import { Modal, Button } from 'native-base';

export default function EditAndDeleteModal({
  isEditDelOpen,
  setIsEditDelOpen,
  setDeleteOpen,
  setEditOpen,
}: {
  isEditDelOpen: boolean;
  setIsEditDelOpen: Function;
  setDeleteOpen: Function;
  setEditOpen: Function;
}) {
  return (
    <Modal
      isOpen={isEditDelOpen}
      onClose={() => {
        setIsEditDelOpen(false);
      }}
    >
      <Modal.Content>
        <Modal.CloseButton></Modal.CloseButton>
        <Modal.Header>Edit or Delete</Modal.Header>
        <Modal.Body>Edit or Delete</Modal.Body>
        <Modal.Footer>
          <Button.Group justifyContent={'space-evenly'}>
            <Button
              onPress={() => {
                setIsEditDelOpen(false);
                setDeleteOpen(true);
              }}
            >
              Delete
            </Button>
            <Button
              onPress={() => {
                setIsEditDelOpen(false);
                setEditOpen(true);
              }}
            >
              Edit
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
