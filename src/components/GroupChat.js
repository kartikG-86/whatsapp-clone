import React, { useContext, useEffect } from "react";
import GroupChatDisplay from "./GroupChatDisplay";
import ChatSidebar from "./ChatSidebar";
import Sidebar from "./Sidebar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../AppContext";

const GroupChat = () => {
    const { id } = useParams();
    const { setGroupMessage} = useContext(AppContext);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/connection/groupMessages/${id}`).then((res) => {
            console.log(res)
            setGroupMessage(res.data.groupMessages)
        }).catch(err => {
            console.log(err)
        })

    }, [])
    return <>
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
                        <div className='col-xl-9 col-lg-8 col-md-7 d-block d-xs-none chat-box'>

                            <GroupChatDisplay />


                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default GroupChat
