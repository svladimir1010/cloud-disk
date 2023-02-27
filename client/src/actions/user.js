import axios from 'axios'
import { API_URL } from '../config'
import { setUser } from '../reducers/userReducer'

export const registration = async(email, password) => {
  try {
    const response = await axios.post(`${API_URL}api/auth/registration`, {
      email: email,
      password: password
    })
    console.log('login')
    alert(response.data.message)
  } catch( e ) {
    console.log(e.response)
    alert(e.response.data.message)
  }
}

export const login = (email, password) => {
  return async dispatch => {
    try {
      const response = await axios.post(`${API_URL}api/auth/login`, {
        email: email,
        password: password
      })
      dispatch(setUser(response.data.user))
      localStorage.setItem('token', response.data.token)
      console.log('login')
      // console.log( 'response.data: ', response.data)
    } catch( e ) {
      console.log(e.message)
      alert(e.response.data.message)
    }
  }

}

export const auth = () => {
  return async dispatch => {
    try {
      const response = await axios.get(`${API_URL}api/auth/auth`,
          {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
      dispatch(setUser(response.data.user))
      localStorage.setItem('token', response.data.token)
      console.log('auth')
    } catch( e ) {
      // alert( e.response.data.message )
      localStorage.removeItem('token')
    }
  }

}

export const uploadAvatar = file => {
  return async dispatch => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await axios.post(`${API_URL}api/files/avatar`, formData,
          {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
      dispatch(setUser(response.data))
      console.log('uploadAvatar')
    } catch( e ) {
      console.log(e.message)
    }
  }
}

export const deleteAvatar = () => {
  return async dispatch => {
    try {
      const response = await axios.delete(`${API_URL}api/files/avatar`,
          {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
      dispatch(setUser(response.data))
      console.log('deleteAvatar')
    } catch( e ) {
      console.log(e.message)
    }
  }
}


