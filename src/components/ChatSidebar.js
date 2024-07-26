import React from "react";

const ChatSidebar = ({setUser , setIsChatOpen}) => {
    const users = [
        {
            name: "Virat Kholi",
            imgUrl: 'https://pbs.twimg.com/profile_images/1562753500726976514/EPSUNyR3_400x400.jpg',
            message: 'hello ji',
            lastTime: '5:14 PM'
        }, {
            name: "Suresh Raina",
            imgUrl: 'https://pbs.twimg.com/profile_images/1655113319509020672/_Yfif2T0_400x400.jpg',
            message: 'kya haal hai bhidu',
            lastTime: '4:20 PM'
        }, {
            name: "Shahrukh Khan",
            imgUrl: 'https://i.pinimg.com/736x/15/ca/0c/15ca0c352322cb9101e20e423ec34554.jpg',
            message: "It's really a Nice Weather, isn't it?",
            lastTime: '1:20 AM'
        }, {
            name: "Hrithik Roshan",
            imgUrl: 'https://pbs.twimg.com/profile_images/1673287602957594626/-mPsrmGn_400x400.jpg',
            message: 'hello ji',
            lastTime: '2:20 PM'
        }]

    const changeChat = (index) => {
        setUser(users[index])
        setIsChatOpen(true)
    }
    return <><div className='col-3 chat-box'>
        <div className='d-flex flex-row justify-content-between'>
            <div className='fs-5 p-4'> Chats</div>
            <div className='p-4'>
                <i class="bi bi-pencil-square icon mx-4"></i>
                <i class="bi bi-filter icon mx-1"></i>
            </div>
        </div>
        <div class="input-group mb-3 search">
            <span class="input-group-text search-icon" id="basic-addon1"><i class="bi bi-search icon"></i></span>
            <input type="text" class="" placeholder="Username" />
        </div>

        {users.map((user, index) => (
            <div onClick={() => changeChat(index)} key={index} className='user-chat d-flex flex-row justify-content-between '>
                <div className='d-flex flex-row justify-content-left'>
                    <img src={user.imgUrl} alt={user.name} />
                    <div className='d-flex flex-column mx-3'>
                        <div className='userName'>{user.name}</div>
                        <div className='userMessage'>{user.message}</div>
                    </div>
                </div>
                <div className='lastTime'>
                    {user.lastTime}
                </div>
            </div>
        ))}
    </div></>
}

export default ChatSidebar