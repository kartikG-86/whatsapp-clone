// import Avatar from 'react-avatar';
// import './App.css';
// import { Routes, Route, useLocation } from "react-router-dom";

// import ChatDisplay from './components/ChatDisplay';
// import Sidebar from './components/Sidebar'
// import React, { useState } from 'react';

// import WhatsApp from './components/Whatsapp';
// import Signup from './components/Signup';
// import Login from './components/Login';
// import Reset from './components/Reset';
// import PrivateRoute from './components/PrivateRoute';
// function App() {


//   return (
//     <>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route element={<PrivateRoute />}>
//           <Route path="/" element={<WhatsApp />} />
//         </Route>
//         <Route path="/signUp" element={<Signup />} />
//         <Route path="/reset" element={<Reset />} />
//         <Route path="/chat/:id" element={<WhatsApp />} />
//       </Routes>
//     </>
//   );
// }

// export default App;


// App.js
// App.js
import React from 'react';
import { Routes, Route } from "react-router-dom";
import Signup from './components/Signup';
import Login from './components/Login';
import Reset from './components/Reset';
import PrivateRoute from './components/PrivateRoute';
import { SocketProvider } from './SocketContext'; // Import SocketProvider
import { AppProvider } from './AppContext'; // Import AppProvider
import WhatsApp from './components/Whatsapp';
import ChatSection from './components/chatSection';
import GroupChat from './components/GroupChat';

function App() {
  return (
    <AppProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<WhatsApp />} />
          </Route>
          <Route path="/signUp" element={<Signup />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/chat/:id" element={<ChatSection />} />
          <Route path="/group/chat/:id" element={<GroupChat />} />
        </Routes>
    </AppProvider>
  );
}

export default App;


