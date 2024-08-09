// import React, { useEffect, useState } from "react";
// import ChatSidebar from './ChatSidebar';
// import WelcomeMessage from './WelcomeMessage';
// import Sidebar from "./Sidebar";
// import ChatDisplay from "./ChatDisplay";
// import { useLocation, useParams } from "react-router-dom";
// import axios from "axios";
// import { io } from "socket.io-client";
// const SOCKET_SERVER_URL = 'http://localhost:8000'; // Replace with your server URL
// const socket = io(SOCKET_SERVER_URL, { autoConnect: false });
// const WhatsApp = () => {
//     const location = useLocation();
//     const { id } = useParams();
//     const [chatUser, setChatUser] = useState({});
//     const [user, setUser] = useState();
//     const [isChatOpen, setIsChatOpen] = useState(false);
//     const [sideBarList, setSideBarList] = useState([{
//         _id: '66a7162fc44e5597dafbe9f0',
//         userName: "Clone Team",
//         imgUrl: "https://i.pinimg.com/736x/93/b2/65/93b265c795140247db600ac92e58746a.jpg",

//     }])
//     const [message, setMessage] = useState([]);

//     useEffect(() => {
//         if (id) {
//             axios.get(`http://localhost:8000/api/connection/getUser/${id}`)
//                 .then((res) => {
//                     console.log(res)
//                     setChatUser(res.data.user);
//                 })
//                 .catch((err) => {
//                     console.log(err);
//                 });
//         }
//     }, [id]);


//     return (
//         <>
//             <div className='chat-container'>
//                 <div className='px-3 py-2'>
//                     <i className="bi bi-whatsapp"></i>
//                     <span className='mx-3 title'>
//                         Whatsapp
//                     </span>
//                 </div>

//                 <div className="d-flex" style={{ height: '93.5%', overflow: 'hidden' }}>
//                     <Sidebar />
//                     <div className='w-100 chat-section'>
//                         <div className='row chat-box'>
//                             <ChatSidebar sideBarList={sideBarList} setSideBarList={setSideBarList} setIsChatOpen={setIsChatOpen} setUser={setUser} />
//                             <div className='col-9 chat-box'>
//                                 {id ? <ChatDisplay sideBarList={sideBarList} setSideBarList={setSideBarList} message={message} setMessage={setMessage} chatUser={chatUser} /> : (
//                                     <div className='d-flex flex-column justify-content-center align-items-center' style={{ height: '100%' }}>
//                                         <WelcomeMessage />
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

// export default WhatsApp;


// WhatsApp.js
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import ChatDisplay from "./ChatDisplay";
import WelcomeMessage from "./WelcomeMessage";
import ChatSidebar from './ChatSidebar';
import { useSocket } from '../SocketContext'; // Import useSocket
import { AppContext } from '../AppContext';
const ChatSection = () => {
    const { id } = useParams();
    const socket = useSocket(); // Get socket from context
    const { chatUser, setChatUser, user, setUser, sideBarList, setSideBarList, message, setMessage } = useContext(AppContext);;
    const currentUserId = localStorage.getItem('userId')
    
    useEffect(() => {
        console.log(window.location.href)
        if (id) {
            axios.get(`http://localhost:8000/api/connection/getUser/${id}`)
                .then((res) => {
                    setChatUser(res.data.user);
                })
                .catch((err) => {
                    console.error(err);
                });

            axios.get(`http://localhost:8000/api/connection/prevMessages/${id}/${currentUserId}`).then((res) => {
                console.log(res.data.previousMessages)
                setMessage(res.data.previousMessages)
            })
        }
    }, [id]);


    return (
        <div className='chat-container'>
            <div className='px-3 py-2'>
                <i className="bi bi-whatsapp" style={{ color: '#25d868' }}></i>
                <span className='mx-3 title'>Whatsapp</span>
            </div>

            <div className="d-flex" style={{ height: '93.5%', overflow: 'hidden' }}>
                <Sidebar />
                <div className='w-100 chat-section'>
                    <div className='row chat-box'>
                        <ChatSidebar />
                        <div className='col-xl-9 col-lg-8 col-md-7 d-block d-xs-none chat-box'>
                            <ChatDisplay />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatSection;
