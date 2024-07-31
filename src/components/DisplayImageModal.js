import React, { useState } from "react";
import '../App.css'
const DisplayImageModal = ({ user, comp }) => {
    return <>
        {user && <div class="modal-dialog">
            <div class="modal-content" style={{

                height: 'max-content',
                width: '20rem',
            }}>

                <div style={{
                    backgroundImage: `url(${user.imgUrl ? user.imgUrl : ''})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '20rem',
                }}>
                    <h1 className="show-dp p-2 px-3">{user.userName ? user.userName : ''}</h1>
                </div>

                <div className="d-flex flex-row justify-content-around py-2 dp-icon">
                    <i class="bi bi-chat-left-text icon "></i>
                    <i class="bi bi-info-circle icon"></i>
                </div>
            </div>
        </div>}

    </>
}

export default DisplayImageModal