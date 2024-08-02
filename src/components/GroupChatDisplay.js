import React, { useEffect, useRef, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import io from 'socket.io-client';
import '../App.css';
import DisplayImageModal from "./DisplayImageModal";
import axios from "axios";
import { AppContext } from "../AppContext";
import DisplayMemberModal from "./DisplayMemberModal";
const GroupChatDisplay = () => {
    const { chatUser, sideBarList, setSideBarList, groupMessage, setGroupMessage, setChatUser, socket, groupChat, setGroupChat, groupMembers, setGroupMembers, io } = useContext(AppContext);
    const { id } = useParams();
    const [changeIcon, setChangeIcon] = useState(false);
    const [newTypedMessage, setNewTypedMessage] = useState('');
    const chatEndRef = useRef(null);
    const currentUser = JSON.parse(localStorage.getItem('user'));

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
        socket.emit('user-joined', { userId: currentUser._id });
        
    }, [])

    useEffect(() => {
        if (id) {
            console.log('now we connect',id)
            socket.emit('join-group', { groupId: id , userName:currentUser.userName })
            
            axios.get(`http://localhost:8000/api/connection/getMemberList/${id}`).then((res) => {
                console.log(res.data.members)
                setGroupMembers(res.data.members)

            }).catch(err => {
                console.log(err)

            })
        }
    }, [id, socket])



    const sendMessage = () => {
        const currentTime = new Date();
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedTime = `${hours}:${formattedMinutes}`;
        const msg = {
            groupId: id,
            message: newTypedMessage,
            time: formattedTime,
            senderId: localStorage.getItem('userId'),
            senderDetails: currentUser
        };
        socket.emit('group-message-receive', msg);
        setNewTypedMessage('');
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [groupMessage]);

    return (
        <>

            {groupMembers != {} ? <>
                <div className="col user-info p-3" data-bs-toggle="modal" data-bs-target="#displayMemberModal">
                    <img src={groupMembers.imgUrl != '' ? groupMembers.imgUrl : 'https://png.pngtree.com/element_our/png/20180904/group-avatar-icon-design-vector-png_75950.jpg'} data-bs-toggle="modal" data-bs-target="#showDp" />
                    <span className="px-3" style={{ fontWeight: '500' }}>{groupMembers.userName}</span>
                </div>

                <div className="col user-chat-area">
                    <div className="chat-display-area ">

                        {groupMessage.length > 0 && groupMessage.map((msg) => (

                            <div >
                                {msg.senderId == localStorage.getItem('userId') ? <div className="text-end m-5">
                                    <div className="px-3 right-message">
                                        <div className="text-start mt-2" style={{ fontWeight: '400', color: 'pink' }}>{currentUser.userName ? currentUser.userName : ''}</div>
                                        <div className="text-start" style={{ lineHeight: '1.6rem' }}>{msg.message}</div>
                                        <div className="text-end pb-1" style={{ color: 'grey', fontWeight: '500', fontSize: '0.75rem' }}>{msg.time}</div>
                                    </div>
                                </div> : <div className="text-start m-3">
                                    <div className="px-3 left-message">
                                        <div className="text-start mt-1" style={{ fontWeight: '400', color: 'pink' }}>{msg.senderDetails.userName}</div>
                                        <div style={{ lineHeight: '1.6rem' }}>{msg.message}</div>
                                        <div className="text-end pb-1" style={{ color: 'grey', fontWeight: '500', fontSize: '0.75rem' }}>{msg.time}</div>
                                    </div>
                                </div>}
                            </div>


                        ))}
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
                    <DisplayImageModal user={groupMembers} comp='chat display' />
                </div>
                <div className="modal fade" id="displayMemberModal" tabIndex="-1" aria-labelledby="displayMemberModalLabel" aria-hidden="true">
                    <DisplayMemberModal groupMembers={groupMembers} setGroupMembers={setGroupMembers} setSideBarList={setSideBarList} />
                </div>

            </> : <></>}
        </>
    );
}

export default GroupChatDisplay