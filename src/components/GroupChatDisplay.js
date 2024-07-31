import React, { useEffect, useRef, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import io from 'socket.io-client';
import '../App.css';
import DisplayImageModal from "./DisplayImageModal";
import axios from "axios";
import { AppContext } from "../AppContext";
import DisplayMemberModal from "./DisplayMemberModal";
const GroupChatDisplay = () => {
    const { chatUser, sideBarList, setSideBarList, message, setMessage, setChatUser, socket, groupChat, setGroupChat } = useContext(AppContext);
    const { id } = useParams();
    const [groupMembers, setGroupMembers] = useState([])
    const [changeIcon, setChangeIcon] = useState(false);
    const [newTypedMessage, setNewTypedMessage] = useState('');
    const chatEndRef = useRef(null);

    const newMessage = (e) => {
        setNewTypedMessage(e.target.value);
        setChangeIcon(e.target.value !== '');
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    };

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:8000/api/connection/getMemberList/${id}`).then((res) => {
                console.log(res.data.members)
                setGroupMembers(res.data.members)
            }).catch(err => {
                console.log(err)

            })
        }
    }, [id])
    const sendMessage = () => {
        const currentTime = new Date();
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedTime = `${hours}:${formattedMinutes}`;
        const msg = {
            fromUserId: localStorage.getItem('userId'),
            message: newTypedMessage,
            toUserId: chatUser._id,
            time: formattedTime
        };
        socket.emit('message', msg);
        setMessage((prevMessages) => [...prevMessages, msg]); // Update local message state for sender
        const userExists = sideBarList.some((item) => item._id === chatUser._id);
        setSideBarList((prevList) => {
            const userExists = prevList.some(item => item._id === chatUser._id);

            if (userExists) {
                return prevList.map(item =>
                    item._id === chatUser._id ? { ...item, time: formattedTime } : item
                );
            }
        });
        console.log(userExists, chatUser)
        if (!userExists) {
            setSideBarList((prevList) => [...prevList, chatUser]);
        }
        setNewTypedMessage('');
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [message]);

    return (
        <>
            <div className="col user-info p-3" data-bs-toggle="modal" data-bs-target="#displayMemberModal">
                <img src={groupChat.user.imgUrl} data-bs-toggle="modal" data-bs-target="#showDp" />
                <span className="px-3" style={{ fontWeight: '500' }}>{groupChat.user.userName}</span>
            </div>

            <div className="col user-chat-area">
                <div className="chat-display-area ">


                    <div ref={chatEndRef} />


                </div>
                <div className='d-flex flex-column justify-content-end align-items-center' >
                    <div className="input-group search chat-search p-1 col" >
                        <span className="input-group-text search-icon col-1" id="basic-addon1" >
                            <i className="bi bi-emoji-smile icon"></i>
                            <i className="bi bi-paperclip icon mx-3" style={{ transform: 'rotate(220deg)' }}></i>
                        </span>
                        <input onKeyDown={handleKeyDown} onChange={newMessage} type="text" value={newTypedMessage} className="message-input col-10" placeholder="Type a message..." />
                        <div className="text-center col-1">
                            {!changeIcon ? <i className="bi bi-mic icon"></i> : <i onClick={sendMessage} className="bi bi-send icon send-icon"></i>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="showDp" tabIndex="-1" aria-labelledby="displayImageModalLabel" aria-hidden="true">
                <DisplayImageModal user={groupChat.user} comp='chat display' />
            </div>
            <div className="modal fade" id="displayMemberModal" tabIndex="-1" aria-labelledby="displayMemberModalLabel" aria-hidden="true">
                <DisplayMemberModal groupMembers={groupMembers} />
            </div>
        </>
    );
}

export default GroupChatDisplay