import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../AppContext";
import axios from "axios";
import { useParams } from "react-router-dom";

const InformationModal = ({ groupMembers, setGroupMembers, type, infoSidebar, chatUser }) => {
    const { setSideBarList } = useContext(AppContext);
    const [searchText, setSearchText] = useState('')
    const currentUser = JSON.parse(localStorage.getItem('user'))
    const { id } = useParams()
    const [showSidebarInfo, setShowSidebarInfo] = useState('Overview')
    const [isEditName, setIsEditName] = useState(false)
    const [isDescription, setIsDescription] = useState(false)
    const [permissions, setPermissions] = useState([{
        name: "Edit group settings",
        para: "This includes the name, icon and description",
        isSelect: true
    }, {
        name: 'Send messages',
        para: '',
        isSelect: true
    }, {
        name: 'Add other members',
        para: '',
        isSelect: true
    }])

    const [commonGroups, setCommonGroups] = useState([])

    useEffect(() => {
        if (type == 'single') {
            console.log(currentUser._id, id)
            axios.get(`http://localhost:8000/api/connection/commonGroups/${currentUser._id}/${id}`).then((res) => {
                setCommonGroups(res.data.commonGroups)
            }).catch(err => {
                console.log(err)
            })
        }
    }, [])

    const getFormattedDate = () => {
        const date = new Date(groupMembers.createdAt)
        const options = {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };

        const formattedDate = date.toLocaleString('en-US', options);
        return formattedDate
    }

    const changeInfo = (index) => {
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



    const changePermission = (permission) => {
        console.log(permission)
        setPermissions((prevPermissions) => {
            return prevPermissions.map((perm) => {
                if (perm.name == permission.name) {
                    return {
                        ...perm,
                        isSelect: !perm.isSelect
                    }
                }
                return perm
            })
        })
    }


    return <>
        <div class="modal-dialog" >
            <div class="modal-content" style={{
                height: '40rem',
                width: '35rem',
            }}>

                <div className="row " style={{ height: '100%', overflow: 'hidden' }}>
                    <div className="col-4 py-1 d-flex flex-column justify-content-between">
                        <div>
                            {infoSidebar.map((sideItem, index) => (
                                <div className={` py-2 my-1 ms-1 group-sidebar ${showSidebarInfo == sideItem.name ? 'group-sidebar-clicked' : ''} d-flex flex-row justify-content-left`} onClick={() => changeInfo(sideItem.name)}>
                                    <span className="me-4"></span>
                                    <div>
                                        <i class={`bi ${sideItem.icon} icon me-3`} style={{ fontSize: '1.2rem' }}></i>
                                        {sideItem.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {type == 'group' && <div className={` py-2 my-1 ms-1 group-sidebar ${showSidebarInfo == 6 ? 'group-sidebar-clicked' : ''} d-flex flex-row justify-content-left`} onClick={() => changeInfo('Permission')}>
                            <span className="me-4"></span>
                            <div>
                                <i class={`bi bi-gear icon me-3`} style={{ fontSize: '1.2rem' }}></i>
                                Permission
                            </div>
                        </div>
                        }
                    </div>
                    <div className="col-7 mx-4 py-3 px-3 my-2 group-info">

                        {showSidebarInfo == 'Overview' && type == 'group' ?
                            <div className="d-flex flex-column justify-content-between">
                                <div className="overview" >
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
                                        <h6 className="sub-heading">Created At</h6>
                                        <span>{getFormattedDate}</span>
                                    </div>
                                    <div className="text-start  my-4">
                                        <h6 className="d-flex flex-row justify-content-between">
                                            <span className="sub-heading">Description</span>
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
                                </div>

                                <div className="row row-cols-2 " style={{ borderTop: '1px solid #3c3c3c' }}>
                                    <div className="col text-center mt-3">
                                        <button className="btn exit-btn px-2 py-1" >Exit Group</button>
                                    </div>
                                    <div className="col text-center mt-3">
                                        <button className="btn exit-btn px-2 py-1" style={{ color: '#fe99a4', fontWeight: '400' }} >Report Group</button>
                                    </div>
                                </div>
                            </div>
                            :
                            showSidebarInfo == 'Overview' && type == 'single' ?
                                <div className="d-flex flex-column justify-content-between">
                                    <div className="overview" >
                                        <div className="text-center">
                                            <img className="my-3" style={{ height: '6rem', width: '6rem' }} src={chatUser.imgUrl} />

                                            <div className="my-4">
                                                <h5>  {chatUser.userName}</h5>

                                                <span>~ {chatUser.userName}</span>

                                            </div>
                                        </div>

                                        <div className="text-start my-4">
                                            <h6 className="sub-heading">Phone Number</h6>
                                            <span>1234567890</span>
                                        </div>
                                    </div>

                                    <div className="row row-cols-2 " style={{ borderTop: '1px solid #3c3c3c' }}>
                                        <div className="col text-center mt-3">
                                            <button className="btn exit-btn px-2 py-1" >Exit Group</button>
                                        </div>
                                        <div className="col text-center mt-3">
                                            <button className="btn exit-btn px-2 py-1" style={{ color: '#fe99a4', fontWeight: '400' }} >Report Group</button>
                                        </div>
                                    </div>
                                </div> :
                                <></>
                        }

                        {showSidebarInfo == 'Members' &&
                            <div className="group-members">
                                <h5>Members ({groupMembers.members.length})</h5>
                                <div class="input-group my-4 search col-12" style={{ margin: 0 }}>
                                    <span class="input-group-text search-icon" id="basic-addon1"><i class="bi bi-search icon"></i></span>
                                    <input onChange={getSearchText} value={searchText} onKeyDown={searchName} type='text' class="col" placeholder="Search member..." />
                                </div>
                                {groupMembers.members.map((member) => (
                                    <div className='d-flex flex-row justify-content-between p-2 my-3' >
                                        <div className='d-flex flex-row justify-content-left' >
                                            <img src={member.imgUrl} />

                                            <div className='userName mx-3 my-2'>{member.userName}</div>

                                        </div>
                                        {groupMembers.adminUserId == member._id &&
                                            <img src='/crown2.jpg' style={{ height: '2.8rem', width: '2.8rem' }} />

                                        }
                                    </div>
                                ))}
                            </div>
                        }
                        {showSidebarInfo == 'Groups' &&
                            <div className="group-members">
                                <h5>Groups in common ({commonGroups.length}) </h5>
                                <div class="input-group my-4 search col-12" style={{ margin: 0 }}>
                                    <span class="input-group-text search-icon" id="basic-addon1"><i class="bi bi-search icon"></i></span>
                                    <input onChange={getSearchText} value={searchText} onKeyDown={searchName} type='text' class="col" placeholder="Search group..." />
                                </div>
                                {commonGroups.map((group) => (
                                    <div className='d-flex flex-row justify-content-between p-2 my-3' >
                                        <div className='d-flex flex-row justify-content-left' >
                                            <img src={group.imgUrl} />

                                            <div className='userName mx-3 my-2'>{group.name}</div>

                                        </div>

                                    </div>
                                ))}
                            </div>
                        }
                        {showSidebarInfo == 'Media' &&
                            <div className="group-members" style={{ height: '100%', width: '103%' }}>
                                <h5>Media</h5>
                                <div className="row" style={{ width: '100%', height: '95%' }}>
                                    <div className="d-flex justify-content-center align-items-center" >
                                        <div className="text-center" style={{ color: 'grey', fontWeight: '500' }}>No media to display</div>
                                    </div>
                                </div>
                            </div>
                        }
                        {showSidebarInfo == 'Files' &&
                            <div className="group-members" style={{ height: '100%', width: '103%' }}>
                                <h5>Files</h5>
                                <div className="row" style={{ width: '100%', height: '95%' }}>
                                    <div className="d-flex justify-content-center align-items-center" >
                                        <div className="text-center" style={{ color: 'grey', fontWeight: '500' }}>No files to display</div>
                                    </div>
                                </div>
                            </div>
                        }
                        {showSidebarInfo == 'Links' &&
                            <div className="group-members" style={{ height: '100%', width: '103%' }}>
                                <h5>Links</h5>
                                <div className="row" style={{ width: '100%', height: '95%' }}>
                                    <div className="d-flex justify-content-center align-items-center" >
                                        <div className="text-center" style={{ color: 'grey', fontWeight: '500' }}>No links to display</div>
                                    </div>
                                </div>
                            </div>
                        }
                        {showSidebarInfo == "Encryption" &&
                            <div className="group-members" style={{ height: '100%', width: '103%' }}>
                                <h5>Encryption</h5>
                                <div className="encryption" style={{ width: '100%', height: '95%' }}>
                                    <p className="mt-3">WhatsApp Clone secures your conversations with end-to-end encryption.</p>
                                    <p className="my-4">Your messages and calls stay between you and
                                        the people and businesses you choose. Not even WhatsApp can read or listen to them. <a href="https://faq.whatsapp.com/820124435853543/?locale=en_US&eea=0" className="learn_more" target="_blank"> Learn more</a></p>
                                </div>
                            </div>
                        }
                        {showSidebarInfo == 'Permission' && type == "group" &&
                            <div className="group-members" style={{ height: '100%', width: '103%' }}>
                                <h5>Group Permissions</h5>
                                <div className="my-4" style={{ width: '100%', height: '95%' }}>
                                    <span className="my-3" style={{ fontSize: '1.1rem' }}>Members can</span>
                                    {permissions.map((permission) => (
                                        <div className="d-flex flex-row justify-content-between my-4">
                                            <div>
                                                <div className="grey-text">{permission.name}</div>
                                                <p style={{ width: '12rem' }}>{permission.para}</p>
                                            </div>

                                            <div className="form-check form-switch">
                                                <input
                                                    className={`form-check-input toggle ${permission.isSelect ? 'toggle-on' : 'toggle-off'}`}
                                                    type="checkbox"
                                                    id="flexSwitchCheckDefault"
                                                    checked={permission.isSelect}
                                                    onChange={() => changePermission(permission)}
                                                    style={{ width: '2rem', height: '1rem' }}
                                                />

                                            </div>

                                        </div>
                                    ))}
                                </div>
                            </div>
                        }
                    </div>
                </div>



            </div>
        </div>
    </>
}

export default InformationModal