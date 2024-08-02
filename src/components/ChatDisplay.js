import React, { useEffect, useRef, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import io from 'socket.io-client';
import '../App.css';
import DisplayImageModal from "./DisplayImageModal";
import axios from "axios";
import { AppContext } from "../AppContext";
import EmojiModal from "./EmojiModal";
import EmojiPicker from "emoji-picker-react";
const SOCKET_SERVER_URL = 'http://localhost:8000'; // Replace with your server URL
const socket = io(SOCKET_SERVER_URL, { autoConnect: false });

const ChatDisplay = () => {

    const { chatUser, sideBarList, setSideBarList, message, setMessage, setChatUser, socket } = useContext(AppContext);

    const { id } = useParams();
    const newUser = JSON.parse(localStorage.getItem('user'));
    const [changeIcon, setChangeIcon] = useState(false);
    const [newTypedMessage, setNewTypedMessage] = useState('');
    const chatEndRef = React.createRef();
    const emojiRef = useRef(null);

    const [isShowEmoji, setIsShowEmoji] = useState(false)
    const showEmojiPallete = () => {
        setIsShowEmoji(!isShowEmoji)
    }
    useEffect(() => {
        socket.connect()
    }, [])

    const handleClickOutside = (event) => {
        // Check if the click is outside of the emoji palette and the button
        if (emojiRef.current && !emojiRef.current.contains(event.target)) {
            setIsShowEmoji(false);
        }
    };

    useEffect(() => {
        // Add event listener to document when component mounts
        document.addEventListener('mousedown', handleClickOutside);
        
        // Clean up event listener when component unmounts
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
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [message]);


    return (
        <>
            <div className="col user-info p-3">
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
                    {message && message.map((msg, index) => (
                        <div >
                            {msg.fromUserId === localStorage.getItem('userId') ? (
                                <div key={index} className="text-end m-5">
                                    <div className="px-3 right-message">
                                        <div className="text-start mt-2" style={{ fontWeight: '400', color: 'pink' }}>{newUser.userName}</div>
                                        <div className="text-start" style={{ lineHeight: '1.6rem' }}>{msg.message}</div>
                                        <div className="text-end pb-1" style={{ color: 'grey', fontWeight: '500', fontSize: '0.75rem' }}>{msg.time}</div>
                                    </div>
                                </div>
                            ) : (
                                <div key={index} className="text-start m-3">
                                    <div className="px-3 left-message">
                                        <div className="text-start mt-1" style={{ fontWeight: '400', color: 'pink' }}>{chatUser.userName}</div>
                                        <div style={{ lineHeight: '1.6rem' }}>{msg.message}</div>
                                        <div className="text-end pb-1" style={{ color: 'grey', fontWeight: '500', fontSize: '0.75rem' }}>{msg.time}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>
                <div className='d-flex flex-column justify-content-end align-items-center' >
                    <div className="input-group  chat-search p-1 col" >
                        <span className="input-group-text dropup search-icon col-1" id="basic-addon1" >
                            <i className="bi bi-emoji-smile icon" onClick={showEmojiPallete}></i>
                            <div ref={emojiRef} style={{ position: 'absolute', bottom: '3rem', left: '-0.25rem' }} className={`${isShowEmoji ? 'd-block' : 'd-none'}`} >
                                <EmojiPicker skinTonesDisabled="true" theme="dark" open="true" onEmojiClick={(data) => {
                                    setNewTypedMessage((prevMessage) => {
                                      return prevMessage + data.emoji
                                    })
                                }} />
                            </div>
                            <i class="bi bi-paperclip icon mx-3" style={{ transform: 'rotate(220deg)' }}></i>
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
            <div className="modal fade" id="showEmoji" tabIndex="-1" aria-labelledby="showEmojiModalLabel" aria-hidden="true">
                <EmojiModal />
            </div>
        </>
    );
}

export default ChatDisplay;
