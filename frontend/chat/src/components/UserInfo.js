import React from 'react';

function UserInfo({ userName, userId }) {
  return (
    <div>
      <label>
        Name: {userName}
        <br />
        ID: {userId}
      </label>
    </div>
  );
}

export default UserInfo;
