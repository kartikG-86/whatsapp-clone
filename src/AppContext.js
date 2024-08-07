// import React, { createContext, useState, useEffect } from 'react';
// import { io } from 'socket.io-client';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';

// const SOCKET_SERVER_URL = 'http://localhost:8000';
// const socket = io(SOCKET_SERVER_URL, { autoConnect: false });

// export const AppContext = createContext();

// export const AppProvider = ({ children }) => {
//     const [chatUser, setChatUser] = useState({});
//     const [groupChat, setGroupChat] = useState({})
//     const [user, setUser] = useState();
//     const [message, setMessage] = useState([]);
//     const [groupMessage, setGroupMessage] = useState([])
//     const [groupMembers, setGroupMembers] = useState({})
//     const { id } = useParams();

//     const [sideBarList, setSideBarList] = useState([
//         {
//             _id: '66a7162fc44e5597dafbe9f0',
//             user: {
//                 userName: "Clone Team",
//                 imgUrl: "https://i.pinimg.com/736x/93/b2/65/93b265c795140247db600ac92e58746a.jpg",
//             },

//         }
//     ]);

//     const updateLocalMessage = (msg) => {
//         const date = new Date();
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const year = date.getFullYear();
//         const todayDate = `${day}/${month}/${year}`;


//         setMessage((prevMessageData) => {
//             const messageCopy = [...prevMessageData];
//             const dateIndex = messageCopy.findIndex((prevMessages) => prevMessages._id === todayDate);

//             if (dateIndex !== -1) {
//                 messageCopy[dateIndex].messages.push(msg);
//             } else {
//                 messageCopy.push({
//                     _id: todayDate,
//                     messages: [msg]
//                 });
//             }

//             return messageCopy;
//         });
//     };


//     const currentUserId = localStorage.getItem('userId');



//     // to connect to all joined groups
//     useEffect(() => {
//         console.log("your newww list", sideBarList)
//         if (sideBarList.length > 0) {
//             sideBarList.map((user) => {
//                 if (user.user.adminUserId) {
//                     console.log(user.user)
//                     socket.emit('join-group', { adminUser: user.user.adminUserId, userIds: user.user.memberUserIds, groupId: user.user._id })
//                 }
//             })
//         }
//     }, [sideBarList])

//     useEffect(() => {
//         if (!currentUserId) {
//             console.error('No user ID found in local storage.');
//             return;
//         }
//         socket.connect()
//         socket.emit('user-joined', { userId: currentUserId });

//         // Fetch user list
//         axios.get(`http://localhost:8000/api/connection/userList/${currentUserId}`)
//             .then((res) => {
//                 console.log('User list fetched:', res.data.userList);
//                 setSideBarList((prevList) => {
//                     const newUsers = res.data.userList.filter(user =>
//                         !prevList.some(item => item._id === user._id)
//                     );
//                     return [...prevList, ...newUsers];
//                 });
//             })
//             .catch(err => {
//                 console.error('Error fetching user list:', err);
//             });

//         // Handle incoming messages
//         const handleMessage = (msg) => {
//             console.log("neeeeee mess", msg)
//             if (msg.toUserId === currentUserId) {
//                 updateLocalMessage(msg)
//                 axios.get(`http://localhost:8000/api/connection/getUser/${msg.fromUserId}`)
//                     .then((res) => {
//                         const user = res.data.user;
//                         console.log('your new user message', sideBarList, { _id: user._id, user: user })
//                         setSideBarList(prevList => {
//                             console.log(!prevList.some(item => item._id === user._id))
//                             if (!prevList.some(item => item._id === user._id)) {
//                                 return [...prevList, { _id: user._id, user: user }];
//                             }
//                             return prevList;
//                         });
//                     })
//                     .catch(err => {
//                         console.error('Error fetching user:', err);
//                     });


//                 // update time 
//                 setSideBarList((prevList) => {
//                     const userExists = prevList.some(item => item._id === msg.fromUserId);
//                     if (userExists) {
//                         return prevList.map(item =>
//                             item._id === msg.fromUserId ? { ...item, time: msg.time } : item
//                         );
//                     }
//                     return prevList;
//                 });


//             }
//         };

//         const handleGroupMessage = (msg) => {
//             console.log("Your group message", msg)
//             setGroupMessage((prevMessages) => [...prevMessages, msg])
//             console.log(groupMessage)
//         }
//         const handleJoinGroup = (msg) => {
//             console.log("Group Join notification", msg)
//             socket.emit('join-group', msg)
//             setTimeout(() => {
//                 socket.emit('get-updated-list', { id: currentUserId })
//             }, 2000)
//         }

//         const handleUpdatedList = (res) => {
//             setSideBarList((prevList) => {
//                 const newUsers = res.userList.filter(user =>
//                     !prevList.some(item => item._id === user._id)
//                 );
//                 return [...prevList, ...newUsers];
//             });
//         }

//         const handleDeleteMessage = (msg) => {
//             console.log(msg)
//             setMessage(prevMessages =>
//                 prevMessages.map(prevMsg =>
//                     prevMsg.msgId === msg.msgId
//                         ? { ...prevMsg, deleteType: msg.deleteType }
//                         : prevMsg
//                 )
//             );
//         }

//         socket.on('receive-message', handleMessage);
//         socket.on('group-message', handleGroupMessage)
//         socket.on('join-group-message', handleJoinGroup)
//         socket.on('your-updated-list', handleUpdatedList)
//         socket.on('message-delete', handleDeleteMessage)

//         return () => {
//             socket.off('receive-message', handleMessage);
//             socket.off('group-message', handleGroupMessage);
//             socket.disconnect()
//         };
//     }, [currentUserId]); // Adding currentUserId to the dependency array to handle changes

//     return (
//         <AppContext.Provider value={{ socket, sideBarList, setSideBarList, chatUser, setChatUser, user, setUser, message, setMessage, groupChat, setGroupChat, groupMembers, setGroupMembers, groupMessage, setGroupMessage, io, setGroupMessage, updateLocalMessage }}>
//             {children}
//         </AppContext.Provider>
//     );
// };

import React, { createContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const SOCKET_SERVER_URL = 'http://localhost:8000';
const socket = io(SOCKET_SERVER_URL, { autoConnect: false });

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [chatUser, setChatUser] = useState({});
    const [groupChat, setGroupChat] = useState({});
    const [user, setUser] = useState();
    const [message, setMessage] = useState([]);
    const [groupMessage, setGroupMessage] = useState([]);
    const [groupMembers, setGroupMembers] = useState({});
    const { id } = useParams();

    const [sideBarList, setSideBarList] = useState([
        {
            _id: '66a7162fc44e5597dafbe9f0',
            user: {
                userName: "Clone Team",
                imgUrl: "https://i.pinimg.com/736x/93/b2/65/93b265c795140247db600ac92e58746a.jpg",
            },
        }
    ]);

    const updateLocalMessage = (msg) => {
        const date = new Date();
        const todayDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;


        setMessage((prevMessageData) => {
            const messageCopy = [...prevMessageData];
            const dateIndex = messageCopy.findIndex((prevMessages) => prevMessages._id === todayDate);

            if (dateIndex !== -1) {
                const length = messageCopy[dateIndex].messages.length
                const lastMessage = messageCopy[dateIndex].messages[length - 1]
                if ((lastMessage.createdAt != msg.createdAt && lastMessage.fromUserId == msg.fromUserId) || (msg.fromUserId != lastMessage.fromUserId)) {
                    console.log('double')
                    messageCopy[dateIndex].messages.push(msg);
                }

            } else {
                messageCopy.push({
                    _id: todayDate,
                    messages: [msg]
                });
            }

            return messageCopy;
        });
    };

    const currentUserId = localStorage.getItem('userId');

    useEffect(() => {
        console.log("your new list", sideBarList)
        sideBarList.forEach((user) => {
            if (user.user.adminUserId) {
                socket.emit('join-group', { adminUser: user.user.adminUserId, userIds: user.user.memberUserIds, groupId: user.user._id });
            }
        });
    }, [sideBarList]);

    useEffect(() => {
        if (!currentUserId) {
            console.error('No user ID found in local storage.');
            return;
        }

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
            console.log("new message", msg);
            if (msg.toUserId === currentUserId) {
                updateLocalMessage(msg);
                axios.get(`http://localhost:8000/api/connection/getUser/${msg.fromUserId}`)
                    .then((res) => {
                        const user = res.data.user;
                        console.log('new user message', sideBarList, { _id: user._id, user: user });
                        setSideBarList(prevList => {
                            if (!prevList.some(item => item._id === user._id)) {
                                return [...prevList, { _id: user._id, user: user }];
                            }
                            return prevList;
                        });
                    })
                    .catch(err => {
                        console.error('Error fetching user:', err);
                    });

                // update time
                setSideBarList((prevList) => {
                    return prevList.map(item =>
                        item._id === msg.fromUserId ? { ...item, time: msg.time } : item
                    );
                });
            }
        };

        const handleGroupMessage = (msg) => {
            console.log("Group message", msg);
            setGroupMessage((prevMessages) => [...prevMessages, msg]);
        };

        const handleJoinGroup = (msg) => {
            console.log("Group Join notification", msg);
            socket.emit('join-group', msg);
            setTimeout(() => {
                socket.emit('get-updated-list', { id: currentUserId });
            }, 2000);
        };

        const handleUpdatedList = (res) => {
            setSideBarList((prevList) => {
                const newUsers = res.userList.filter(user =>
                    !prevList.some(item => item._id === user._id)
                );
                return [...prevList, ...newUsers];
            });
        };

        const handleDeleteMessage = (msg) => {
            console.log(msg);
            setMessage(prevMessageData => {
                return prevMessageData.map(prevMessages => {
                    if (prevMessages._id === msg.date) {
                        return {
                            ...prevMessages,
                            messages: prevMessages.messages.map(existingMsg =>
                                existingMsg.msgId === msg.msgId
                                    ? { ...existingMsg, deleteType: msg.deleteType }
                                    : existingMsg
                            )
                        };
                    }
                    return prevMessages;
                });
            });
            
        };

        socket.on('receive-message', handleMessage);
        socket.on('group-message', handleGroupMessage);
        socket.on('join-group-message', handleJoinGroup);
        socket.on('your-updated-list', handleUpdatedList);
        socket.on('message-delete', handleDeleteMessage);

        return () => {
            socket.off('receive-message', handleMessage);
            socket.off('group-message', handleGroupMessage);
            socket.off('join-group-message', handleJoinGroup);
            socket.off('your-updated-list', handleUpdatedList);
            socket.off('message-delete', handleDeleteMessage);
            socket.disconnect();
        };
    }, [currentUserId]); // Adding currentUserId to the dependency array to handle changes

    return (
        <AppContext.Provider value={{ socket, sideBarList, setSideBarList, chatUser, setChatUser, user, setUser, message, setMessage, groupChat, setGroupChat, groupMembers, setGroupMembers, groupMessage, setGroupMessage, io, setGroupMessage, }}>
            {children}
        </AppContext.Provider>
    );
};
