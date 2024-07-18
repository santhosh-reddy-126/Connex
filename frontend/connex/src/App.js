import react from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './screen/Login';
import Home from './screen/Home';
import Chat from './screen/Chat';
import Profile from "./screen/Profile";
import Signup from './screen/Signup';
import Search from './screen/Search';
import Chatpage from './screen/Chatpage';
function App() {
  

  return (
      <Router>
        <Routes>
          <Route exact path='/' element={<Login />}/>
          <Route exact path='/signup' element={<Signup />}/>
          <Route exact path='/home' element={<Home />}/>
          <Route exact path='/chat' element={<Chat />}/>
          <Route exact path='/profile' element={<Profile />}/>
          <Route exact path='/search' element={<Search />}/>
          <Route exact path='/chat2' element={<Chatpage />}/>
        </Routes>
      </Router>
  )
}

export default App
