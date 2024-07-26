import React from "react";
import '../App.css';
import Avatar from 'react-avatar';

const Sidebar = () => {
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
                <Avatar size='30' className='avatar ' name="Kartik Goyal" />
            </div>

        </div>
    </>
}

export default Sidebar