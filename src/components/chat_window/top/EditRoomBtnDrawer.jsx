import { ref, set } from "firebase/database";
import React, { memo } from "react";
import { useParams } from "react-router";
import { Button, Drawer } from "rsuite";
import { useCurrentRoom } from "../../../context/current-room.context";
import { useMediaQuery, useModalState } from "../../../misc/custom-hooks";
import { database } from "../../../misc/firebase.config";
import EditableInput from "../../EditableInput";
import { showSuccessAlert, showErrorAlert } from "../../../misc/sweet-alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const EditRoomBtnDrawer = () => {
  const { chatId } = useParams();
  const { isOpen, open, close } = useModalState();
  const isMobile = useMediaQuery("(max-width: 992px)");
  const isSmallMobile = useMediaQuery("(max-width: 320px)");

  const name = useCurrentRoom((v) => v.name);
  const description = useCurrentRoom((v) => v.description);

  const updateData = (key, value) => {
    set(ref(database, `/rooms/${chatId}/${key}`), value)
      .then(() => {
        // Use SweetAlert2 success alert
        showSuccessAlert(
          'Updated',
          `Room ${key} has been successfully updated`
        );
      })
      .catch((err) => {
        // Use SweetAlert2 error alert
        showErrorAlert(
          'Error',
          err.message
        );
      });
  };

  const onNameSave = (newName) => {
    updateData("name", newName);
  };

  const onDescriptionSave = (newDesc) => {
    updateData("description", newDesc);
  };

  return (
    <>
      <Button
        className="br-circle"
        size="xs"
        color="blue"
        onClick={open}
        appearance="primary"
        style={{
          fontSize: '0.7rem',
          width: '24px',
          height: '24px',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <FontAwesomeIcon icon={faPencilAlt} size="xs" />
      </Button>

      <Drawer
        size={isMobile ? "full" : "md"}
        open={isOpen}
        onClose={close}
        placement="right"
        className="edit-room-drawer"
      >
        <Drawer.Header>
          <Drawer.Title>
            <div className="edit-room-title">
              <span>Edit Study Group</span>
            </div>
          </Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <div className="edit-room-content">
            <div className="edit-section">
              <h6 className="section-label">Group Name</h6>
              <p className="section-description">Give your study group a clear, descriptive name</p>
              <EditableInput
                initialValue={name}
                onSave={onNameSave}
                emptyMsg="Group name cannot be empty"
                placeholder="Enter group name..."
                className="edit-input"
              />
            </div>

            <div className="edit-section">
              <h6 className="section-label">Group Description</h6>
              <p className="section-description">Describe what your group is about, topics covered, etc.</p>
              <EditableInput
                as="textarea"
                rows={isSmallMobile ? 3 : 4}
                initialValue={description}
                onSave={onDescriptionSave}
                emptyMsg="Group description cannot be empty"
                placeholder="Enter group description..."
                className="edit-input"
              />
            </div>
          </div>

          <Drawer.Actions>
            <Button
              appearance="primary"
              color="blue"
              onClick={close}
              style={{
                borderRadius: '8px',
                fontWeight: '600',
                padding: isSmallMobile ? '6px 12px' : '8px 16px',
                fontSize: isSmallMobile ? '0.85rem' : 'inherit',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                border: 'none'
              }}
            >
              Done
            </Button>
            <Button
              appearance="subtle"
              onClick={close}
              style={{
                borderRadius: '8px',
                fontWeight: '600',
                padding: isSmallMobile ? '6px 12px' : '8px 16px',
                fontSize: isSmallMobile ? '0.85rem' : 'inherit',
                marginRight: isSmallMobile ? '6px' : '10px'
              }}
            >
              Cancel
            </Button>
          </Drawer.Actions>
        </Drawer.Body>
      </Drawer>
    </>
  );
};

export default memo(EditRoomBtnDrawer);
