import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserInfo({ userName, userEmail }) {
  return (
    <div className="container mt-4"
    
    >
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">User Information</h5>
          <hr />
          <p className="card-text">
            <strong>Name:</strong> {userName}
          </p>
          <p className="card-text">
            <strong>Email:</strong> {userEmail}
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
