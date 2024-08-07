import React, { useEffect, useRef, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import io from 'socket.io-client';
import '../App.css';
import DisplayImageModal from "./DisplayImageModal";
import axios from "axios";
import { AppContext } from "../AppContext";
import DisplayMemberModal from "./DisplayMemberModal";
const GroupChatDisplay = () => {
    const { setSideBarList, groupMessage, socket, groupMembers, setGroupMembers } = useContext(AppContext);
    const { id } = useParams();
    const [changeIcon, setChangeIcon] = useState(false);
    const [newTypedMessage, setNewTypedMessage] = useState('');
    const chatEndRef = useRef(null);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const emojiRef = useRef(null);

    const [isShowEmoji, setIsShowEmoji] = useState(false)
    const showEmojiPallete = () => {
        setIsShowEmoji(!isShowEmoji)
    }
    useEffect(() => {
        socket.connect()
    }, [])

    const handleClickOutside = (event) => {
        if (emojiRef.current && !emojiRef.current.contains(event.target)) {
            setIsShowEmoji(false);
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

    useEffect(() => {
        socket.emit('user-joined', { userId: currentUser._id });

    }, [])

    useEffect(() => {
        if (id) {
            console.log('now we connect', id)
            socket.emit('join-group', { groupId: id, userName: currentUser.userName })

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
        chatEndRef.current?.scrollIntoView();
    }, [groupMessage]);

    return (
        <>

            {groupMembers != {} ? <>
                <div className="col user-info p-3 d-flex flex-row" data-bs-toggle="modal" data-bs-target="#displayMemberModal">
                    <img src={groupMembers.imgUrl != '' ? groupMembers.imgUrl : 'https://png.pngtree.com/element_our/png/20180904/group-avatar-icon-design-vector-png_75950.jpg'} data-bs-toggle="modal" data-bs-target="#showDp" />
                    <div className="d-flex flex-column">
                    <span className="px-3" style={{ fontWeight: '500' }}>{groupMembers.userName}</span>
                       <span className="mx-3 mt-1">{groupMembers != {} && groupMembers.members && groupMembers.members.map((member,index) => <span style={{color:'grey'}}>{member.userName == currentUser.userName ? 'You': member.userName} {index == groupMembers.members.length - 1 ? '' : ', '}</span> )}</span> 
                    </div>
                  
                    
                </div>

                <div className="col user-chat-area">
                    <div className="chat-display-area ">

                        {groupMessage && groupMessage.length > 0 && groupMessage.map((prevMsg, prevIndex) => (

                            <React.Fragment key={prevIndex}>
                                <div className="text-center my-4">
                                    <span className="my-3 msg-date">{prevMsg._id}</span>
                                </div>
                                {prevMsg.messages.map((msg, index) => (
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
                            </React.Fragment>

                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <div className='d-flex flex-column justify-content-end align-items-center' >
                        <div className="input-group search chat-search p-1 col" >
                            <span className="input-group-text search-icon col-1" id="basic-addon1" >
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