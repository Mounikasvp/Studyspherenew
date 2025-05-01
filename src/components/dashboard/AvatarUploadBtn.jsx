import React from "react";
import { useProfile } from "../../context/profile.context";
import ProfileAvatar from "../ProfileAvatar";

const AvatarUploadBtn = () => {
  const { profile } = useProfile();

  return (
    <div className="avatar-container">
      <ProfileAvatar
        src={profile.avatar}
        name={profile.name}
        className="width-200 height-200 img-fullsize font-huge"
      />
    </div>
  );
};

export default AvatarUploadBtn;
