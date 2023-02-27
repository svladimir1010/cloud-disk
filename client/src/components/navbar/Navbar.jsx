import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { getFiles, searchFiles } from '../../actions/file'
import logo from '../../assets/img/navbar-logo.svg'
import avatarLogo from '../../assets/img/user-avatar.svg'
import { API_URL } from '../../config'
import { showLoader } from '../../reducers/appReducer'
import { logout } from '../../reducers/userReducer'
import './navbar.less'

const Navbar = () => {
  const isAuth = useSelector(state => state.user.isAuth)
  const currentUser = useSelector(state => state.user.currentUser)
  const currentDir = useSelector(state => state.files.currentDir)
  const [ searchName, setSearchName ] = useState('')
  const [ searchTimeout, setSearchTimeout ] = useState(false)
  const dispatch = useDispatch()
  const avatar = currentUser?.avatar ? `${API_URL + currentUser?.avatar}` : avatarLogo

  function searchChangeHandler(e) {
    setSearchName(e.target.value)
    if(searchTimeout) {
      clearTimeout(searchTimeout)
    }
    dispatch(showLoader())
    if(e.target.value !== '') {
      setSearchTimeout(setTimeout(value => {
        dispatch(searchFiles(value))
      }, 500, e.target.value))
    } else {
      dispatch(getFiles(currentDir))
    }

  }

  return (
      <nav className="navbar">
        <div className="container">
          <img src={logo} alt="logo" className="navbar__logo"/>
          <div className="navbar__header">MERN CLOUD</div>
          {isAuth && <input
              value={searchName}
              onChange={e => searchChangeHandler(e)}
              type="text"
              className="navbar__search"
              placeholder="Название файла..."/>}

          {!isAuth && <div className="navbar__login"><NavLink to="/login">Войти</NavLink></div>}
          {!isAuth && <div className="navbar__registration"><NavLink to="/registration">Регистрация</NavLink></div>}
          {isAuth
              &&
              <div
                  className="navbar__login"
                  onClick={() => dispatch(logout())}
              >
                Выход
              </div>}
          {isAuth && <NavLink to="/profile">
            <img className='navbar__avatar' src={avatar} alt="avatar"/>
          </NavLink>}
        </div>
      </nav>
  )
}

export default Navbar
