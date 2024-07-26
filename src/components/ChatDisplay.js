import React from "react";
import '../App.css';

const ChatDisplay = ({ user }) => {
    return <>
        <div className="col user-info p-3">

            <img src={user.imgUrl} />
            <span className="px-3" style={{ fontWeight: '500' }}>{user.name}</span>
        </div>

        <div className="col user-chat-area">

            <div
                className='d-flex flex-column justify-content-end align-items-center '
                style={{ height: '100%' }}
            >
                <div class="input-group search chat-search p-2">
                    <span class="input-group-text search-icon" id="basic-addon1">
                        <i className="bi bi-emoji-smile icon" ></i>
                        <i className="bi bi-paperclip icon mx-3"></i>
                    </span>
                    <input type="text" class="" placeholder="Type a message..." />
                    <div className="text-end" style={{width:'8rem'}}>
                    <i class="bi bi-mic icon" ></i>
                    </div>
                </div>
            </div>

        </div>
    </>
}

export default ChatDisplay