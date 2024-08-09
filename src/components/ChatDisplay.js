import React, { useEffect, useRef, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import uuid from 'react-uuid';

import io from 'socket.io-client';
import '../App.css';
import DisplayImageModal from "./DisplayImageModal";
import axios from "axios";
import { AppContext } from "../AppContext";
import EmojiModal from "./DeleteModal";
import EmojiPicker from "emoji-picker-react";
import DeleteModal from "./DeleteModal";
import InformationModal from "./InformationModal";
const SOCKET_SERVER_URL = 'http://localhost:8000'; // Replace with your server URL
const socket = io(SOCKET_SERVER_URL, { autoConnect: false });

const ChatDisplay = () => {

    const { chatUser, sideBarList, setSideBarList, message, setMessage, setChatUser, socket } = useContext(AppContext);

    const { id } = useParams();
    const newUser = JSON.parse(localStorage.getItem('user'));
    const [changeIcon, setChangeIcon] = useState(false);
    const [newTypedMessage, setNewTypedMessage] = useState('');
    const [isAttach, setIsAttach] = useState(false)
    const [deleteMsg, setDeleteMsg] = useState({})
    const [deleteId, setDeleteId] = useState('')
    const chatEndRef = useRef(null);
    const emojiRef = useRef(null);
    const attachFileRef = useRef(null)

    const [isShowEmoji, setIsShowEmoji] = useState(false)

    const getCurrentTime = () => {
        const currentTime = new Date();
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedTime = `${hours}:${formattedMinutes}`;
        return formattedTime
    }
    const showEmojiPallete = () => {
        setIsShowEmoji(!isShowEmoji)
    }
    useEffect(() => {
        socket.connect()
    }, [])


    const updateLocalMessage = (msg) => {
        const date = new Date();
        const todayDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

        setMessage((prevMessageData) => {
            const messageCopy = [...prevMessageData];
            const dateIndex = messageCopy.findIndex((prevMessages) => prevMessages._id === todayDate);

            if (dateIndex !== -1) {

                messageCopy[dateIndex].messages.push(msg);
            } else {
                messageCopy.push({
                    _id: todayDate,
                    messages: [msg]
                });
            }

            return messageCopy;
        });
    };

    const handleClickOutside = (event) => {
        if (emojiRef.current && !emojiRef.current.contains(event.target)) {
            setIsShowEmoji(false);
        }
        if (attachFileRef.current && !attachFileRef.current.contains(event.target)) {
            setIsAttach(false)
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const newMessage = (e) => {
        setNewTypedMessage(e.target.value);
        setChangeIcon(e.target.value !== '');
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    };

    const sendMessage = () => {
        const formattedTime = getCurrentTime()
        const msg = {
            fromUserId: localStorage.getItem('userId'),
            message: newTypedMessage,
            toUserId: chatUser._id,
            time: formattedTime,
            msgId: uuid(),
            deleteType: null
        };
        socket.emit('message', msg);
        updateLocalMessage(msg)

        const userExists = sideBarList.some((item) => item._id === chatUser._id);
        if (!userExists) {
            console.log(sideBarList, chatUser)
            setSideBarList((prevList) => [...prevList, { _id: chatUser._id, user: chatUser }]);
        }
        setSideBarList((prevList) => {
            const userExists = prevList.some(item => item._id === chatUser._id);

            if (userExists) {
                return prevList.map(item =>
                    item._id === chatUser._id ? { ...item, time: formattedTime } : item
                );
            }
        });
        console.log(userExists, chatUser)

        setNewTypedMessage('');
    };

    useEffect(() => {
        console.log('hello')
        console.log(message)
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
            console.log(message)
        }
    }, [message]);

    const attachFiles = () => {
        setIsAttach(!isAttach)
    }

    const sendImage = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (e) => {
            const formattedTime = getCurrentTime()
            const msg = {
                fromUserId: localStorage.getItem('userId'),
                message: reader.result,
                toUserId: chatUser._id,
                time: formattedTime,
                msgId: uuid(),
                deleteType: null
            };
            socket.emit('message', msg);
            setMessage((prevMessages) => [...prevMessages, msg]);
        }
    }

    const groupSidebar = [{
        name: "Overview",
        icon: "bi-info-circle"
    }, {
        name: "Media",
        icon: 'bi-music-note-list'
    }, {
        name: "Files",
        icon: 'bi-file-earmark'
    }, {
        name: "Links",
        icon: 'bi-link'
    }, {
        name: "Encryption",
        icon: 'bi-shield-lock'
    },{
        name: "Groups",
        icon: 'bi-people'
    }]


    return (
        <>
            <div className="col user-info p-3" data-bs-toggle="modal" data-bs-target="#oneToOneInformationModal">
                <img src={chatUser.imgUrl} data-bs-toggle="modal" data-bs-target="#showDp" />
                <span className="px-3" style={{ fontWeight: '500' }}>{chatUser.userName}</span>
            </div>

            <div className="col user-chat-area">
                <div className="chat-display-area ">
                    {chatUser._id === '66a7162fc44e5597dafbe9f0' && (
                        <div className="text-center py-5">
                            <span className="welcome-background">This is an official Account of Whatsapp Clone Team</span>
                            <div className="text-start m-3">
                                <div className="px-3 left-message">
                                    <div className="text-start mt-1" style={{ fontWeight: '400', color: 'pink' }}>{chatUser.userName}</div>
                                    <div style={{ lineHeight: '1.6rem' }}>Welcome to our app, {newUser.userName}! We're glad to have you here.</div>
                                    <div className="text-end pb-1" style={{ color: 'grey', fontWeight: '500', fontSize: '0.75rem' }}>17:15 PM</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {message && message.length > 0 && message.map((prevMsg, prevIndex) => (
                        <div key={prevIndex}>
                            <div className="text-center my-5">
                                <span className="my-3 msg-date">{prevMsg._id}</span>
                            </div>
                            {prevMsg.messages.map((msg, index) => (
                                <div key={msg.msgId}>
                                    {msg.fromUserId === localStorage.getItem('userId') ? (
                                        <div className="text-end m-3">
                                            <div className="px-3 right-message"
                                                onMouseOver={() => {
                                                    if (!msg.deleteType) {
                                                        setDeleteMsg({...msg,date:prevMsg._id});
                                                        setDeleteId(msg.msgId);
                                                    }
                                                }}
                                                onMouseOut={() => setDeleteId('')}>
                                                <div className="d-flex flex-row justify-content-between mt-2" style={{ fontWeight: '400', color: 'pink' }}>
                                                    <div style={{ color: 'pink' }}> {newUser.userName} </div>
                                                    <div data-bs-toggle="modal" data-bs-target="#deleteMessage" className={`${deleteId === msg.msgId ? 'd-block' : 'd-none'}`}>
                                                        <i className="bi bi-trash3 delete-btn"></i>
                                                    </div>
                                                </div>
                                                {msg.message.includes('data:image') && !msg.deleteType ? (
                                                    <img src={msg.message} alt="image" style={{ width: '20rem', height: '20rem' }} />
                                                ) : (
                                                    <div className="text-start" style={{ lineHeight: '1.6rem' }}>
                                                        {msg.deleteType == null ? msg.message : (
                                                            <div className="delete-msg-text">
                                                                <i className="bi bi-ban me-2 delete-message-icon"></i>
                                                                You deleted this message.
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="text-end pb-1 msg-time">{msg.time}</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-start m-3">
                                            <div className="px-3 left-message">
                                                <div className="text-start mt-1" style={{ fontWeight: '400', color: 'pink' }}>
                                                    {chatUser.userName}
                                                </div>
                                                {msg.message.includes('data:image') && !msg.deleteType ? (
                                                    <img src={msg.message} alt="image" style={{ width: '20rem', height: '20rem' }} />
                                                ) : (
                                                    <div className="text-start" style={{ lineHeight: '1.6rem' }}>
                                                        {!msg.message.includes('data:image') && (msg.deleteType == null || msg.deleteType === 'me') ? msg.message : (
                                                            <div className="delete-msg-text">
                                                                <i className="bi bi-ban me-2 delete-message-icon"></i>
                                                                This message was deleted.
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="text-end pb-1 msg-time">{msg.time}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}

                    <div ref={chatEndRef} />
                </div>
                <div className='d-flex flex-column justify-content-end align-items-center' >
                    <div className="input-group  chat-search p-1 col" >
                        <span className="input-group-text search-icon col-1" id="basic-addon1" >
                            <i className="bi bi-emoji-smile icon" onClick={showEmojiPallete}></i>
                            <div ref={emojiRef} style={{ position: 'absolute', bottom: '3rem', left: '-0.25rem' }} className={`${isShowEmoji ? 'd-block' : 'd-none'}`} >
                                <EmojiPicker skinTonesDisabled="true" theme="dark" open="true" onEmojiClick={(data) => {
                                    setNewTypedMessage((prevMessage) => {
                                        return prevMessage + data.emoji
                                    })
                                }} />
                            </div>
                            <i class="bi bi-paperclip icon mx-3" style={{ transform: 'rotate(220deg)' }} onClick={attachFiles}></i>
                            <div ref={attachFileRef} className={`${isAttach ? 'd-block' : 'd-none'} attachFiles`} >
                                <div className="text-start">
                                    <input type="file" hidden id="actual-btn" onChange={sendImage} />
                                    <label for="actual-btn" className="selectImage p-1">
                                        <i class="bi bi-image mx-2 icon"></i> Photos & Videos
                                    </label>
                                </div>
                                <div className="text-start">
                                    <input type="file" hidden id="document" />
                                    <label for="document" className="selectImage p-1">
                                        <i class="bi bi-file-earmark mx-2 icon"></i> Documents
                                    </label>
                                </div>
                            </div>
                        </span>
                        <input onKeyDown={handleKeyDown} onChange={newMessage} type="text" value={newTypedMessage} className="col-10" placeholder="Type a message..." />
                        <div className="text-center col-1">
                            {!changeIcon ? <i className="bi bi-mic icon"></i> : <i onClick={sendMessage} className="bi bi-send icon send-icon"></i>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="showDp" tabIndex="-1" aria-labelledby="displayImageModalLabel" aria-hidden="true">
                <DisplayImageModal user={chatUser} comp='chat display' />
            </div>
            <div className="modal fade" id="deleteMessage" tabIndex="-1" aria-labelledby="deleteMessageModalLabel" aria-hidden="true">
                <DeleteModal deleteMsg={deleteMsg} />
            </div>
            <div className="modal fade" id="oneToOneInformationModal" tabIndex="-1" aria-labelledby="oneToOneInformationModalLabel" aria-hidden="true">
                    <InformationModal type="single" infoSidebar={groupSidebar} chatUser={chatUser}  />
                </div>
        </>
    );
}

export default ChatDisplay;
