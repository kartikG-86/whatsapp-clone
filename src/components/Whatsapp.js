
// WhatsApp.js
import React, { useEffect, useState , useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import WelcomeMessage from "./WelcomeMessage";
import ChatSidebar from './ChatSidebar';
import { useSocket } from '../SocketContext'; // Import useSocket
import { AppContext } from '../AppContext';
const WhatsApp = () => {
    const { id } = useParams();
    const socket = useSocket(); // Get socket from context
    const { chatUser, setChatUser, user, setUser, sideBarList, setSideBarList, message, setMessage } = useContext(AppContext);
    const currentUserId = localStorage.getItem('userId')
    useEffect(() => {
        if (!currentUserId) {
            console.error('No user ID found in local storage.');
            return;
        }

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
    }, [currentUserId]);
    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:8000/api/connection/getUser/${id}`)
                .then((res) => {
                    setChatUser(res.data.user);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [id]);

    return (
        <div className='chat-container'>
            <div className='px-3 py-2'>
                <i className="bi bi-whatsapp"></i>
                <span className='mx-3 title'>Whatsapp</span>
            </div>

            <div className="d-flex" style={{ height: '93.5%', overflow: 'hidden' }}>
                <Sidebar />
                <div className='w-100 chat-section'>
                    <div className='row chat-box'>
                        <ChatSidebar />
                        <div className=' col-xl-9 col-lg-8 col-md-7 d-block d-xs-none chat-box'>
                            <div
                                className='d-flex flex-column justify-content-center align-items-center'
                                style={{ height: '100%' }}
                            >
                                <WelcomeMessage />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WhatsApp;
