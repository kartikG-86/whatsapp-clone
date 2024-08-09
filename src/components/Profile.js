import React from "react";

const Profile = ({ user }) => {
    return <>
        <div class="modal-dialog" >
            <div class="modal-content" >
                <div className="d-flex flex-column justify-content-between">
                    <div className="overview" >
                        <div className="text-start mx-4 my-3">
                            <img className="my-3" style={{ height: '6rem', width: '6rem' }} src={user.imgUrl ? user.imgUrl : ''} />
                            <div className="my-4">
                                <h5>  {user.userName}</h5>
                            </div>
                        </div>

                        <div className="text-start my-4 mx-4">
                            <h6 className="sub-heading">About</h6>
                            <span>-</span>
                        </div>
                        <div className="text-start my-4 mx-4">
                            <h6 className="sub-heading">Phone Number</h6>
                            <span>1234567890</span>
                        </div>
                    </div>
                    <div className="p-4">
                        <button className="col-12 btn btn-danger">Logout</button>
                    </div>
                </div>





            </div>
        </div>
    </>
}

export default Profile