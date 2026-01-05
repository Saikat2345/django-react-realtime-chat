import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Layout from './Layout';
import Login from './Components/Login/Login';
import ChatRoom from './Components/ChatRoom/ChatRoom';
import RoomJoin from './Components/RoomJoin/RoomJoin';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router-dom';


function Root() {
  // VALID: Hooks must be inside a component
  const [roomName, setRoomName] = useState("");
  const [userx, setuserx]=useState(false)


  // Router
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout userx={userx} setuserx={setuserx} />}>
        <Route path="" element={<Login setuserx={setuserx} />} />

        {/* Room join route */}
        <Route
          path="/roomjoin"
          element={
            userx?(
          <RoomJoin setRoomName={setRoomName} />):
          (<Navigate to="/"/>)
        }
        />

        {/* Protected chat route */}
        <Route
          path="/chat"
          element={
            roomName ? (
              <ChatRoom roomName={roomName} />
            ) : (
              <Navigate to="/roomjoin" />
            )
          }
        />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);

reportWebVitals();
