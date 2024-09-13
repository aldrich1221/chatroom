// import React, { useState, useEffect } from 'react';
// import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
// import { messaging } from 'firebase-admin';

// // Use the actual file path if you have a file with real data
// // import fakeFriendsData from "../../fakeData/friends.js";



// const fakeFriendsData = {
//   "allUserFriends": [
//     {
//       "userId": "8v2jXLxrcMcR5lcB83etN3P6Rcf2",
//       "userName": "User A",
//       "friends": [
//         {
//           "userId": "ikrDLQmTrkSkkNHrMno0HKeAvOk1",
//           "userName": "Friend B",
//           "channelId": "111"
//         },
//         {
//           "userId": "123",
//           "userName": "Friend C",
//           "channelId": "222"
//         }
//       ]
//     },
//     {
//       "userId": "ikrDLQmTrkSkkNHrMno0HKeAvOk1",
//       "userName": "User B",
//       "friends": [
//         {
//           "userId": "8v2jXLxrcMcR5lcB83etN3P6Rcf2",
//           "userName": "Friend A",
//           "channelId": "111"
//         },
//         {
//           "userId": "321",
//           "userName": "Friend D",
//           "channelId": "333"
//         }
//       ]
//     }
//   ]
// };

// const FriendsList = ({ changeChannel }) => {
//   const [friends, setFriends] = useState([]);
//   const auth = getAuth();
//   const currentUserId = auth.currentUser?.uid;

//   useEffect(() => {
//     if (currentUserId) {
//       // Simulate fetching user data from fakeFriendsData
//       if (fakeFriendsData && fakeFriendsData.allUserFriends) {
//         const currentUserData = fakeFriendsData.allUserFriends.find(user => user.userId === currentUserId);
//         if (currentUserData && currentUserData.friends) {
//           setFriends(currentUserData.friends);
//         } else {
//           setFriends([]);
//         }
//       }
//     }
//   }, [currentUserId]);

//   const handleButtonClick = (channelId) => {
//     changeChannel(channelId);
//   };

//   return (
//     <div>
//       <h3>Friends List</h3>
//       <ul>
//         {friends.map((friend, index) => (
//           <li key={index}>
//             {friend.userName || 'Unnamed'} (ID: {friend.userId}) (Channel: {friend.channelId})
//             <button onClick={() => handleButtonClick(friend.channelId)}>Switch to Channel</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default FriendsList;
