import Avatar from 'react-avatar';
import './App.css';
import ChatDisplay from './components/ChatDisplay';
import Sidebar from './components/Sidebar'
import { useState } from 'react';
import ChatSidebar from './components/ChatSidebar';
import WelcomeMessage from './components/WelcomeMessage';
function App() {

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

  let [isChatOpen, setIsChatOpen] = useState(false)

  let [user , setUser] = useState()

  return (
    <>
      <div className='chat-container'>

        <div className='px-3 py-2'>
          <i class="bi bi-whatsapp"></i>
          <span className='mx-3 title'>
            Whatsapp
          </span>
        </div>

        <div className="d-flex" style={{ height: '93.5%', overflow: 'hidden' }}>

          <Sidebar></Sidebar>

          <div className='w-100 chat-section'>
            <div className='row chat-box'>
              <ChatSidebar setIsChatOpen={setIsChatOpen} setUser = {setUser} />
              <div className='col-9 chat-box'>
                {!isChatOpen ? (
                  <div
                    className='d-flex flex-column justify-content-center align-items-center'
                    style={{ height: '100%' }}
                  >
                    <WelcomeMessage />
                  </div>
                ) : <>
                
                <ChatDisplay user={user} />

                </>}
              </div>


            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default App;
