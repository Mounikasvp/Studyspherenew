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
      const updates = await getUserUpdates(
        profile.uid,
        "name",
        newData,
        database
      );

      await update(ref(database), updates);

      // Use SweetAlert2 success alert
      showSuccessAlert(
        'Profile Updated',
        'Your nickname has been updated successfully'
      );
    } catch (error) {
      // Use SweetAlert2 error alert
      showErrorAlert(
        'Update Error',
        error.message
      );
    }
  };

  const [activeTab, setActiveTab] = React.useState('profile');

  return (
    <div className="dashboard-container">
      <Drawer.Header>
        <Drawer.Title>Dashboard</Drawer.Title>
      </Drawer.Header>

      <Drawer.Body>
        <Nav appearance="tabs" activeKey={activeTab} onSelect={setActiveTab}>
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
      </Drawer.Body>
    </div>
  );
};

export default Dashboard;
