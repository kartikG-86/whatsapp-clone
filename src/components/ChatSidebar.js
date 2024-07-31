import React, { useContext, useEffect, useRef, useState } from "react";
import NewChatModal from "./NewChatModal";
import NewGroupModal from "./NewGroupModal";
import DisplayImageModal from "./DisplayImageModal";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from '../AppContext';

const ChatSidebar = () => {
    const { setUser, sideBarList, setSideBarList, groupChat, setGroupChat, groupMembers, setGroupMembers, setMessage } = useContext(AppContext);
    const { id } = useParams()
    const navigate = useNavigate()
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedTime = `${hours}:${formattedMinutes}${hours < 12 ? 'AM' : 'PM'}`;

    const [isPhoneNumber, setIsPhoneNumber] = useState(false);
    const [isGroupChat, setIsGroupChat] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [selectUser, setSelectUser] = useState({})
    const [searchUserList, setSearchUserList] = useState([])

    const chatByGroup = () => {
        setIsGroupChat(true)
        setIsPhoneNumber(false)
        setSearchValue('')
    }

    const chatByPhoneNumber = () => {
        setIsPhoneNumber(true)
        setIsGroupChat(false)
        setSearchValue('')

    }
    const changeChat = (user) => {
        console.log('navigate', user)

        if (user.user.adminUserId) {
            setMessage([])
            navigate(`/group/chat/${user._id}`)
        }
        else {
            setUser(user)
            navigate(`/chat/${user._id}`)
        }
    }

    const backToSearch = () => {
        setIsPhoneNumber(false)
        setIsGroupChat(false)
        setSearchValue('')
    }

    const searchUser = (e) => {
        axios.get(`http://localhost:8000/api/connection/searchUser/${e}`).then((res) => {
            setSearchUserList(res.data.users)
        })

    }

    const closePrevModal = () => {
        setIsGroupChat(false)
        setIsPhoneNumber(false)
    }

    const showDp = (user) => {
        console.log(user)
        setSelectUser(null)
        setSelectUser(user)
    }

    useEffect(() => {
        console.log("Your new sidebar list", sideBarList)
    }, [sideBarList])


    return <>
        <div className={`col-xl-3 col-lg-4 col-md-4 chat-box ${id && window.matchMedia('(max-width: 1040px) ').matches ? 'd-none' : 'd-block'} `}>
            <div className='d-flex flex-row justify-content-between'>
                <div className='fs-5 p-4'> Chats</div>
                <div className='p-4'>
                    <i onClick={closePrevModal} class="bi bi-pencil-square icon mx-4" data-bs-toggle="modal" data-bs-target="#newChatModal"></i>
                    <i class="bi bi-filter icon mx-1"></i>
                </div>
            </div>
            <div class="input-group mb-3 px-3 col-12 search" >
                <span class="input-group-text search-icon" id="basic-addon1"><i class="bi bi-search icon"></i></span>
                <input type="text" class="col" placeholder="Username" />
            </div>

            {sideBarList.length > 0 && <div className="all_users ">
                {sideBarList.length > 0 && sideBarList.map((user, index) => (
                    <div onClick={() => changeChat(user)} key={user._id} className='user-chat d-flex flex-row justify-content-between '>
                        <div className='d-flex flex-row justify-content-left'>
                            <img onClick={() => showDp(user.user)} src={user.user.imgUrl ? user.user.imgUrl : ''} alt={user.user.userName ? user.user.userName : ''} data-bs-toggle="modal" data-bs-target="#show_dp_modal" />
                            <div className='d-flex flex-column mx-3'>
                                <div className='userName'>{user.user.userName ? user.user.userName : ''}</div>

                                {/* <div className='userMessage'>{user.latestMessage ? user.latestMessage : ''}</div> */}
                            </div>
                        </div>
                        <div className='lastTime'>
                            {user.time ? user.time : ''}
                        </div>
                    </div>
                ))}
            </div>}
        </div>

        <div class="modal fade" id="newChatModal" tabindex="-1" aria-labelledby="newChatModalLabel" aria-hidden="true">
            <NewChatModal isPhoneNumber={isPhoneNumber} searchValue={searchValue} backToSearch={backToSearch} searchUser={searchUser} chatByPhoneNumber={chatByPhoneNumber} changeChat={changeChat} users={sideBarList} chatByGroup={chatByGroup} isGroupChat={isGroupChat} searchUserList={searchUserList} />
        </div>
        <div class="modal fade" id="show_dp_modal" tabindex="-1" aria-labelledby="displayImageModalLabel" aria-hidden="true">
            <DisplayImageModal user={selectUser} />
        </div>

    </>
}

export default ChatSidebar