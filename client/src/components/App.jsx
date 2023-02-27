import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { auth } from '../actions/user'
import './app.less'
import Login from './authorization/Login'
import Registration from './authorization/Registration'
import Disk from './disk/Disk'
import Navbar from './navbar/Navbar'
import Profile from './profile/Profile'

function App() {
  const isAuth = useSelector(state => state.user.isAuth)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(auth())
  }, [ dispatch ])


  return (
      <Router>
        <div className="app">
          <Navbar/>
          <div className="wrap">
            {!isAuth ?
                <Routes>
                  <Route path="/registration" element={<Registration/>}/>
                  <Route path="/login" element={<Login/>}/>
                  <Route path="*" element={<Login/>}/>
                </Routes>
                :
                <Routes>
                  <Route exact path="/" element={<Disk/>}/>
                  <Route exact path="/profile" element={<Profile/>}/>
                  <Route path="*" element={<Disk/>}/>
                </Routes>

            }
          </div>
        </div>
      </Router>
  )
}

export default App


