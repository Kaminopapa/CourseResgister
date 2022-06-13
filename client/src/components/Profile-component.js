import React from "react";
import AuthService from "../services/auth.service";
const ProfileComponent = ({ currentUser, setCurrentUser }) => {
  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>You must login first before getting your profile.</div>
      )}
      {currentUser && (
        <div>
          <h1>In profile page</h1>
          {/* jumbotron is a bootstrap  */}
          <header className="jumbotron">
            <h3>
              <strong>Name: {currentUser.user.username}</strong>
            </h3>
          </header>

          <p>
            <strong>ID: {currentUser.user._id}</strong>
          </p>
          <p>
            <strong>Email: {currentUser.user.email}</strong>
          </p>
          <p>
            <strong>Role: {currentUser.user.role}</strong>
          </p>
          <p>
            <strong>Token: {currentUser.token}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
