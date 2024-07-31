import React from "react";

const DisplayMemberModal = ({ groupMembers }) => {
    return <>
        <div class="modal-dialog">
            <div class="modal-content" style={{

                height: 'max-content',
                width: '20rem',
            }}>

                {groupMembers && groupMembers[0].members.map((member) => (
                    <div className='d-flex flex-row justify-content-left'>
                        <img  src={member.imgUrl} alt={member.userName} data-bs-toggle="modal" data-bs-target="#show_dp_modal" />
                        <div className='d-flex flex-column mx-3'>
                            <div className='userName'>{member.userName}</div>

                            {/* <div className='userMessage'>{user.latestMessage ? user.latestMessage : ''}</div> */}
                        </div>
                    </div>
                ))}

            </div>
        </div>
    </>
}

export default DisplayMemberModal