import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../AppContext";

const DeleteModal = ({ deleteMsg }) => {

    const { setMessage, message, socket } = useContext(AppContext)
    const [isDelete, setIsDelete] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');

    const deleteMessage = () => {
        setIsDelete(true);
    };

    const handleClose = () => {
        setIsDelete(false);
        setSelectedOption('');
    };

    useEffect(() => {
        setIsDelete(false);
        setSelectedOption('');
    }, []);

    const onDelete = () => {
        console.log('hi', deleteMsg)
        setMessage(prevMessage =>
            prevMessage.map(msg =>
                msg.msgId === deleteMsg.msgId
                    ? { ...msg, deleteType: selectedOption }
                    : msg
            )
        );
        deleteMsg.deleteType = selectedOption
        setIsDelete(false);
        setSelectedOption('');
        socket.emit('delete-message', deleteMsg)
    };

    return (
        <>
            <div className="modal-dialog delete-modal-dialog">
                <div className="modal-content">
                    <div className="modal-header delete-modal" >
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Delete message?</h1>
                    </div>
                    <div className="modal-body delete-modal">
                        <p>You can delete messages for everyone or just for yourself.</p>
                        <form>
                            <div className="form-check my-3">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="flexRadioDefault"
                                    id="flexRadioDefault1"
                                    checked={selectedOption === 'me'}
                                    onChange={() => {
                                        setSelectedOption('me');
                                        deleteMessage('me');
                                    }}
                                />
                                <label className="form-check-label" htmlFor="flexRadioDefault1">
                                    Delete for me
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="flexRadioDefault"
                                    id="flexRadioDefault2"
                                    checked={selectedOption === 'everyone'}
                                    onChange={() => {
                                        setSelectedOption('everyone');
                                        deleteMessage('everyone');
                                    }}
                                />
                                <label className="form-check-label" htmlFor="flexRadioDefault2">
                                    Delete for everyone
                                </label>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer d-flex flex-row justify-content-around delete-btns">
                        <button
                            type="button"
                            className={`btn col-5 ${isDelete ? 'deleteModal-btn' : 'btn-secondary'}`}
                            disabled={!isDelete}
                            onClick={onDelete}
                            data-bs-dismiss="modal"

                        >
                            Delete
                        </button>
                        <button
                            onClick={handleClose}
                            type="button"
                            className="btn btn-secondary col-5"
                            data-bs-dismiss="modal"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DeleteModal;
