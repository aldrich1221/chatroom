// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login.js";
import Signup from "./pages/Signup.js";
import ChatRoom from "./pages/ChatRoom.js";
import { auth } from "./Services/FireBase.js";

function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/chatroom" /> : <Login />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/chatroom" /> : <Signup />}
        />
        <Route
          path="/chatroom"
          element={user ? <ChatRoom /> : <Navigate to="/login" />}
        /> 
  

      </Routes>
    </Router>
  );
}

export default App;