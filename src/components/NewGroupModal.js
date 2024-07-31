import React from "react";

const NewGroupModal = ({ backToSearch, isPhoneNumber, searchValue, searchUser, chatByPhoneNumber, changeChat, users }) => {
    return <> <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header d-flex flex-row justify-content-between">
                <span class="modal-title fs-5" id="exampleModalLabel">{isPhoneNumber ? <> <i onClick={backToSearch} class="bi bi-arrow-left mx-3 icon"></i> <span >Phone Number</span> </> : ' New Chat'}</span>
                {isPhoneNumber ? <></> : <i class="bi bi-x-lg icon" style={{ float: 'right' }} data-bs-dismiss="modal" aria-label="Close"></i>}

            </div>
            <div class="modal-body">
                <div class="input-group mb-4 search" style={{ margin: 0 }}>
                    <span class="input-group-text search-icon" id="basic-addon1"><i class="bi bi-search icon"></i></span>
                    <input value={searchValue} onChange={searchUser} type='text' class="" placeholder="Search name or number" />
                </div>

                {!isPhoneNumber ? <> <div className=" my-3 new-chat py-3 px-2">
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
                        {users.map((user, index) => (
                            <div className=" new-chat px-2" data-bs-dismiss="modal" aria-label="Close">
                                <div onClick={() => changeChat(index)} key={index} className='user-chat d-flex flex-row justify-content-between '>
                                    <div className='d-flex flex-row justify-content-left'>
                                        <img src={user.imgUrl} alt={user.name} />
                                        <div className='d-flex flex-column mx-3'>
                                            <div className='userName'>{user.name}</div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div></>
                    : <>

                    </>}

            </div>

        </div>
    </div></>
}

export default NewGroupModal