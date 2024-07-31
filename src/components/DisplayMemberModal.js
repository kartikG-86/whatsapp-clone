import React, { useState, useContext } from "react";
import { AppContext } from "../AppContext";

const DisplayMemberModal = ({ groupMembers, setGroupMembers }) => {
    const { setSideBarList } = useContext(AppContext);
    const [searchText, setSearchText] = useState('')

    const [showSidebarInfo, setShowSidebarInfo] = useState(1)
    const [isEditName, setIsEditName] = useState(false)
    const [isDescription, setIsDescription] = useState(false)
    const date = new Date(groupMembers.createdAt);

    const options = {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };

    const formattedDate = date.toLocaleString('en-US', options);

    const showMembers = (index) => {
        setShowSidebarInfo(index)
        setIsEditName(false)
        setIsDescription(false)
    }

    const editName = () => {
        setIsEditName(true)
    }

    const editDescription = () => {
        setIsDescription(true)
    }

    const getSearchText = (e) => {
        console.log(e.target.value)
        setSearchText(e.target.value)
    }

    const searchName = (e) => {
        if (e.key == "Enter") {
            console.log("Enter")
        }
    }

    const saveDetails = () => {
        setIsEditName(false)
        setIsDescription(false)
        setSideBarList((prevList) =>
            prevList.map((chat) =>
                chat._id === groupMembers._id
                    ? { ...chat, user: { ...chat.user, userName: groupMembers.userName, description: groupMembers.description } }
                    : chat
            )
        );
    }

    return <>
        <div class="modal-dialog" >
            <div class="modal-content" style={{

                height: '42rem',
                width: '40rem',
            }}>

                <div className="row " style={{ height: '100%' }}>
                    <div className="col-4 py-4">
                        <div className=" px-4 py-2 group-sidebar" onClick={() => showMembers(1)}> <i class="bi bi-info-circle icon me-3"></i>Overview</div>
                        <div className=" px-4 py-2 group-sidebar" onClick={() => showMembers(2)}> <i class="bi bi-people icon me-3"></i> Members</div>
                    </div>
                    <div className="col-7 mx-4 py-3 px-3 my-3 group-info">

                        {showSidebarInfo == 1 &&
                            <div>
                                <div className="text-center">
                                    <img className="my-3" style={{ height: '6rem', width: '6rem' }} src={groupMembers.imgUrl != '' ? groupMembers.imgUrl : 'https://png.pngtree.com/element_our/png/20180904/group-avatar-icon-design-vector-png_75950.jpg'} />

                                    <h5 className="my-4">
                                        {isEditName ? <input type="text" value={groupMembers.userName} onChange={(e) => setGroupMembers({
                                            ...groupMembers,

                                            userName: e.target.value

                                        })} /> : groupMembers.userName}

                                        {isEditName ? <button onClick={saveDetails} className="btn ms-3" style={{ backgroundColor: 'green', color: 'white' }}>Done</button> : <i class="bi bi-pencil mx-2 edit-group-icon" onClick={editName}></i>}
                                    </h5>
                                </div>

                                <div className="text-start my-4">
                                    <h6>Created At</h6>
                                    <span>{formattedDate}</span>
                                </div>
                                <div className="text-start my-4">
                                    <h6 className="d-flex flex-row justify-content-between">
                                        <span>Description</span>
                                        <i onClick={editDescription} class="bi bi-pencil mx-2 edit-group-icon"></i>
                                    </h6>
                                    <p style={{ height: '10rem' }}>
                                        {isDescription ?
                                            <div>
                                                <textarea class="form-control" aria-label="With textarea" value={groupMembers.description} onChange={(e) => setGroupMembers({
                                                    ...groupMembers,

                                                    description: e.target.value

                                                })} />
                                                <div className="text-end">
                                                    <button onClick={saveDetails} className="btn ms-3 my-4" style={{ backgroundColor: 'green', color: 'white' }}>Done</button>
                                                </div>
                                            </div> : groupMembers.description}

                                    </p>
                                </div>

                                <div className="row row-cols-2 ">
                                    <div className="col text-center">
                                        <button className="btn exit-btn px-2 py-1" >Exit Group</button>
                                    </div>
                                    <div className="col text-center">
                                        <button className="btn exit-btn px-2 py-1" style={{ color: '#FF033E', fontWeight: '500' }} >Report Group</button>
                                    </div>
                                </div>
                            </div>

                        }

                        {showSidebarInfo == 2 &&
                            <div className="group-members">
                                <h5>Members ({groupMembers.members.length})</h5>
                                <div class="input-group my-4 search col-12" style={{ margin: 0 }}>
                                    <span class="input-group-text search-icon" id="basic-addon1"><i class="bi bi-search icon"></i></span>
                                    <input onChange={getSearchText} value={searchText} onKeyDown={searchName} type='text' class="col" placeholder="Search name or number" />
                                </div>
                                {groupMembers.members.map((member) => (
                                    <div className='d-flex flex-row justify-content-between p-2 my-3' >
                                        <div className='d-flex flex-row justify-content-left' >
                                            <img src={member.imgUrl} alt={member.userName} />

                                            <div className='userName mx-3 my-2'>{member.userName}</div>

                                        </div>
                                        {groupMembers.adminUserId == member._id && <img src='/crown1.jpg' style={{ height: '2.8rem', width: '2.8rem' }} />}
                                    </div>
                                ))}
                            </div>}
                    </div>
                </div>



            </div>
        </div>
    </>
}

export default DisplayMemberModal