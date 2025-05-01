import React, { useCallback } from "react";
import { Button, Drawer } from "rsuite";
import { useMediaQuery, useModalState } from "../../misc/custom-hooks";
import Dashboard from ".";
import { auth, database } from "../../misc/firebase.config";
import { ref, set } from "firebase/database";
import { isOfflineForDatabase } from "../../context/profile.context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { showToast, showErrorAlert } from "../../misc/sweet-alert";

const DashboardToggle = () => {
  const { isOpen, close, open } = useModalState();
  const isMobile = useMediaQuery("(max-width: 992px)");
  const history = useHistory();

  const onSignOut = useCallback(() => {
    set(ref(database, `/status/${auth.currentUser.uid}`), isOfflineForDatabase)
      .then(() => {
        auth.signOut();
        // Use SweetAlert2 toast notification
        showToast('Signed out successfully', 'success');
        close();
        // Redirect to landing page after sign out
        history.push('/');
      })
      .catch((err) => {
        // Use SweetAlert2 error alert
        showErrorAlert('Sign Out Error', err.message);
      });
  }, [close, history]);

  return (
    <>
      <Button block appearance="primary" onClick={open} className="dashboard-btn">
        <FontAwesomeIcon icon={faUser} /> Dashboard
      </Button>
      <Drawer
        size={isMobile ? "full" : "sm"}
        open={isOpen}
        onClose={close}
        placement="left"
      >
        <Dashboard onSignOut={onSignOut} />
      </Drawer>
    </>
  );
};

export default DashboardToggle;
