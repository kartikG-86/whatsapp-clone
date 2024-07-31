import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from '../AppContext';
import axios from "axios";
const NewChatModal = ({ backToSearch, isPhoneNumber, searchValue, searchUser, chatByPhoneNumber, changeChat, users, chatByGroup, isGroupChat, searchUserList }) => {
    const { chatUser, setChatUser, user, setUser, sideBarList, setSideBarList, message, setMessage, socket } = useContext(AppContext);

    const navigate = useNavigate()
    const [checkedUsers, setCheckedUsers] = useState([]);
    const [groupName, setGroupName] = useState('')
    const [newGroup, setNewGroup] = useState({ name: '', userId: [] })
    const [searchText, setSearchText] = useState('')
    const adminUserId = localStorage.getItem('userId')
    const handleDivClick = (userId) => {
        setCheckedUsers(prevState => {
            if (prevState.includes(userId)) {
                return prevState.filter(id => id !== userId);
            }
            return [...prevState, userId];
        });
    };

    const newGroupName = (e) => {
        setGroupName(e.target.value)
    }

    const groupCreated = () => {
        setNewGroup({
            name: groupName,
            userId: checkedUsers
        });
        const payload = {
            name: groupName,
            userIds: checkedUsers,
            adminUserId: adminUserId
        }
        axios.post(`http://localhost:8000/api/connection/createGroup`, payload).then((res) => {
            console.log(res)
            socket.emit('join-group', { adminUser: res.data.group.adminUserId, userIds: res.data.group.memberUserIds, groupId: res.data.group._id.toString() })
            const currentTime = new Date();
            const hours = currentTime.getHours();
            const minutes = currentTime.getMinutes();
            const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
            const formattedTime = `${hours}:${formattedMinutes}`;
            const newGroupItem = {
                _id: res.data.group._id,
                user: {
                    _id: res.data.group._id,
                    imgUrl: res.data.group.imgUrl,
                    description: res.data.group.description,
                    userName: res.data.group.name,
                    adminUserId: res.data.group.adminUserId,
                    userIds: res.data.group.memberUserIds
                },
                time: formattedTime
            }
            console.log(newGroupItem)
            setSideBarList((prevList) => [...prevList, newGroupItem])
        }).catch(err => {
            console.log(err)
        })
        setGroupName('')
        setCheckedUsers([])
    }

    const getSearchText = (e) => {
        console.log(e.target.value)
        setSearchText(e.target.value)
    }

    const searchName = (e) => {
        if (e.key == "Enter") {
            console.log("Enter")
            searchUser(searchText)
        }
    }

    const directChat = (id) => {
        navigate(`/chat/${id}`)
    }

    return <>

        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header d-flex flex-row justify-content-between">
                    <span class="modal-title fs-5" id="exampleModalLabel">{isPhoneNumber || isGroupChat ? <> <i onClick={backToSearch} class="bi bi-arrow-left mx-3 icon"></i> <span >{isPhoneNumber ? 'Phone Number' : 'Group Chat'}</span> </> : ' New Chat'}</span>
                    {isPhoneNumber ? <></> : <i class="bi bi-x-lg icon" style={{ float: 'right' }} data-bs-dismiss="modal" aria-label="Close"></i>}

                </div>
                <div class="modal-body">
                    <div class="input-group mb-4 search col-12" style={{ margin: 0 }}>
                        <span class="input-group-text search-icon" id="basic-addon1"><i class="bi bi-search icon"></i></span>
                        <input onChange={getSearchText} value={searchText} onKeyDown={searchName} type='text' class="col" placeholder="Search name or number" />
                    </div>

                    {!isPhoneNumber && !isGroupChat ? <>
                        <div className=" my-3 new-chat py-3 px-2" onClick={chatByGroup}>
                            <span className="new-grp-icon"  >
                                <i class="bi bi-people" style={{ fontSize: '1.4rem' }}></i>
                            </span>

                            <span className="mx-3"> New Group </span>
                        </div>
                        <div className=" new-chat py-3 px-2" onClick={chatByPhoneNumber}>
                            <span className="new-grp-icon"  >
                                <i class="bi bi-phone" style={{ fontSize: '1.4rem' }}></i>
                            </span>
                            <span className="mx-3">Phone Number</span>
                        </div>
                        <div className="text-start my-3" style={{ fontSize: '0.85rem', color: 'grey' }}>
                            All Contacts
                        </div>
                        <div className="all-contacts">
                            {sideBarList.map((user, index) => (
                                <div key={user._id} className=" new-chat px-2" data-bs-dismiss="modal" aria-label="Close">
                                    <div onClick={() => changeChat(index)} key={index} className='user-chat d-flex flex-row justify-content-between '>
                                        <div className='d-flex flex-row justify-content-left'>
                                            <img src={user.user.imgUrl} alt={user.user.userName} />
                                            <div className='d-flex flex-column mx-3'>
                                                <div className='userName'>{user.user.userName} </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                        : isGroupChat ? <>

                            {checkedUsers.length > 0 ?
                                <div class="input-group mb-4 search" style={{ margin: 0, }}>
                                    <input value={groupName} onChange={newGroupName} type='text' class="p-3 w-100" placeholder="Enter Group Name" />
                                </div> : <></>}

                            <div className="text-start my-3" style={{ fontSize: '0.85rem', color: 'grey' }}>
                                All Contacts
                            </div>
                            <div className="all-contacts">
                                {sideBarList.map((user, index) => (
                                    <div key={index} className="new-chat px-2">
                                        <div
                                            className='user-chat d-flex flex-row justify-content-between'
                                            onClick={() => handleDivClick(user._id)}
                                        >
                                            <div className='d-flex flex-row justify-content-left'>
                                                <img src={user.user.imgUrl} alt={user.user.userName} />
                                                <div className='d-flex flex-column mx-3'>
                                                    <div className='userName'>{user.user.userName}</div>
                                                </div>
                                            </div>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={checkedUsers.includes(user._id)}
                                                readOnly
                                                id={`flexCheckChecked-${user._id}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="text-end my-3">
                                <button onClick={groupName != '' ? groupCreated : null} disabled={groupName != '' ? false : true} className="btn create-grp-btn" data-bs-dismiss="modal" aria-label="close">Create</button>
                            </div>
                        </> : <>
                            {searchUserList && searchUserList.map((res) => (
                                <div onClick={() => directChat(res._id)} className='d-flex flex-row justify-content-left' style={{ cursor: 'pointer' }} data-bs-dismiss="modal" aria-label="Close">
                                    <img src={res.imgUrl} alt={res.userName} />
                                    <div className='d-flex flex-column mx-3'>
                                        <div className='userName'>{res.userName}</div>
                                    </div>
                                </div>
                            ))}
                        </>}

                </div>

            </div>
        </div>
    </>
}

export default NewChatModal