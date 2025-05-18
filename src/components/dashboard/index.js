import { ref, update } from "firebase/database";
import React from "react";
import { Button, Divider, Drawer, Nav } from "rsuite";
import { useProfile } from "../../context/profile.context";
import { database } from "../../misc/firebase.config";
import { getUserUpdates } from "../../misc/helpers";
import EditableInput from "../EditableInput";
import AvatarUploadBtn from "./AvatarUploadBtn";
import InvitationsList from "./InvitationsList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { showSuccessAlert, showErrorAlert } from "../../misc/sweet-alert";

const Dashboard = ({ onSignOut }) => {
  const { profile } = useProfile();

  const onSave = async (newData) => {
    try {
      // First, update just the user profile
      const basicUpdates = {
        [`/users/${profile.uid}/name`]: newData
      };

      // Try to get full updates (messages and rooms)
      try {
        const fullUpdates = await getUserUpdates(
          profile.uid,
          "name",
          newData,
          database
        );

        // If we got full updates, use those
        await update(ref(database), fullUpdates);
      } catch (error) {
        // If there was an error with full updates, just use basic updates
        console.error("Error with full updates:", error.message);
        await update(ref(database), basicUpdates);
      }

      // Use SweetAlert2 success alert
      showSuccessAlert(
        'Profile Updated',
        'Your nickname has been updated successfully'
      );
    } catch (error) {
      console.error("Profile update error:", error);

      // Handle specific errors
      if (error.message && error.message.includes("Index not defined")) {
        showErrorAlert(
          'Database Index Error',
          'There was an issue with the database indexing. Your profile was updated, but some references may not be updated. Please contact support.'
        );
      } else {
        // Use SweetAlert2 error alert for other errors
        showErrorAlert(
          'Update Error',
          error.message
        );
      }
    }
  };

  const [activeTab, setActiveTab] = React.useState('profile');

  return (
    <div className="dashboard-container">
      <Drawer.Header>
        <Drawer.Title>Dashboard</Drawer.Title>
      </Drawer.Header>

      <Drawer.Body className="dashboard-body">
        <div className="dashboard-content">
          <Nav appearance="tabs" activeKey={activeTab} onSelect={setActiveTab} justified>
            <Nav.Item eventKey="profile" icon={<FontAwesomeIcon icon={faUser} />}>
              Profile
            </Nav.Item>
            <Nav.Item eventKey="invitations" icon={<FontAwesomeIcon icon={faEnvelope} />}>
              Invitations
            </Nav.Item>
          </Nav>

        {activeTab === 'profile' && (
          <div className="profile-section">
            <h3>Hey, {profile.name}</h3>
            <Divider />
            <div className="nickname-section">
              <EditableInput
                name="nickname"
                initialValue={profile.name}
                onSave={onSave}
                label={<h6 className="mb-2">Nickname</h6>}
              />
            </div>
            <div className="avatar-section">
              <AvatarUploadBtn />
            </div>
          </div>
        )}

        {activeTab === 'invitations' && (
          <div className="invitations-section">
            <InvitationsList />
          </div>
        )}

        <Drawer.Actions>
          <Button block color="red" appearance="primary" onClick={onSignOut}>
            Sign Out
          </Button>
        </Drawer.Actions>
        </div>
      </Drawer.Body>
    </div>
  );
};

export default Dashboard;
