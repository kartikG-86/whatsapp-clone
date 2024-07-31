import React, { createContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const SOCKET_SERVER_URL = 'http://localhost:8000';
const socket = io(SOCKET_SERVER_URL, { autoConnect: false });

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [chatUser, setChatUser] = useState({});
    const[groupChat,setGroupChat] = useState({})
    const [user, setUser] = useState();
    const [message, setMessage] = useState([]);

    const [sideBarList, setSideBarList] = useState([
        {
            _id: '66a7162fc44e5597dafbe9f0',
            user: {
                userName: "Clone Team",
                imgUrl: "https://i.pinimg.com/736x/93/b2/65/93b265c795140247db600ac92e58746a.jpg",
            },

        }
    ]);

    const currentUserId = localStorage.getItem('userId');

    useEffect(() => {
        if (!currentUserId) {
            console.error('No user ID found in local storage.');
            return;
        }

        // Connect to socket and emit user joined
        socket.connect();
        socket.emit('user-joined', { userId: currentUserId });

        // Fetch user list
        axios.get(`http://localhost:8000/api/connection/userList/${currentUserId}`)
            .then((res) => {
                console.log('User list fetched:', res.data.userList);
                setSideBarList((prevList) => {
                    const newUsers = res.data.userList.filter(user =>
                        !prevList.some(item => item._id === user._id)
                    );
                    return [...prevList, ...newUsers];
                });
            })
            .catch(err => {
                console.error('Error fetching user list:', err);
            });

        // Handle incoming messages
        const handleMessage = (msg) => {
            if (msg.toUserId === currentUserId) {
                setMessage(prevMessages => [...prevMessages, msg]);

                // update time 
                setSideBarList((prevList) => {
                    const userExists = prevList.some(item => item._id === msg.fromUserId);

                    if (userExists) {
                        return prevList.map(item =>
                            item._id === msg.fromUserId ? { ...item, time: msg.time } : item
                        );
                    }
                });

                axios.get(`http://localhost:8000/api/connection/getUser/${msg.fromUserId}`)
                    .then((res) => {
                        const user = res.data.user;
                        setSideBarList(prevList => {
                            if (!prevList.some(item => item._id === user._id)) {
                                return [...prevList, user];
                            }
                            return prevList;
                        });
                    })
                    .catch(err => {
                        console.error('Error fetching user:', err);
                    });
            }
        };

        const handleGroupMessage = (msg) => {
            console.log("Your group message", msg)
            setMessage([])
            setMessage([msg.message])
        }

        socket.on('receive-message', handleMessage);
        socket.on('group-message', handleGroupMessage)

        return () => {
            socket.off('receive-message', handleMessage);
            socket.off('group-message', handleGroupMessage);
            socket.disconnect();
        };
    }, [currentUserId]); // Adding currentUserId to the dependency array to handle changes

    return (
        <AppContext.Provider value={{ socket, sideBarList, setSideBarList, chatUser, setChatUser, user, setUser, message, setMessage , groupChat, setGroupChat }}>
            {children}
        </AppContext.Provider>
    );
};
