import React, { useState } from "react";
import '../App.css';
import Avatar from 'react-avatar';
import DisplayImageModal from "./DisplayImageModal";

const Sidebar = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const [selectUser, setSelectUser] = useState({})

    const showDp = () => {
        setSelectUser(user)
    }
    return <>
        <div className='d-flex flex-column justify-content-between' style={{ width: '4rem' }}>

            <div className='d-flex flex-column p-3'>
                <i class="bi bi-list mb-3 icon"></i>
                <i class="bi bi-telephone mb-3 icon"></i>
                <i class="bi bi-nut icon"></i>
            </div>

            <div className='d-flex flex-column p-3'>
                <i class="bi bi-star icon mb-3"></i>
                <i class="bi bi-archive icon mb-3"></i>
                <hr />
                <i class="bi bi-gear mt-3 mb-3 icon"></i>
                <img onClick={showDp} src={user.imgUrl} alt={user.name} style={{marginLeft:'-0.5rem'}} data-bs-toggle="modal" data-bs-target="#displayImageModal" />
            </div>
            <div class="modal fade" id="displayImageModal" tabindex="-1" aria-labelledby="displayImageModalLabel" aria-hidden="true">
                <DisplayImageModal user={selectUser} comp='sidebar' />
            </div>
        </div>
    </>
}

export default Sidebar