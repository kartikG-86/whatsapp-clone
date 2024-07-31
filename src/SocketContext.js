// SocketContext.js
import React, { createContext, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:8000'; // Replace with your server URL
const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const socket = io(SOCKET_SERVER_URL, { autoConnect: false });

    useEffect(() => {
        socket.connect();
        socket.emit('user-joined', { userId: localStorage.getItem('userId') });
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
