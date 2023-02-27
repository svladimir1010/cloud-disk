import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deleteAvatar, uploadAvatar } from '../../actions/user'

const Profile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();

  function changeHandler(e) {
    const file = e.target.files[0]
    navigate('/login');
    dispatch(uploadAvatar(file))

  }


  function removeAvatarHandler() {
    navigate('/login');
    dispatch(deleteAvatar())
  }

  return (
      <div style={{display: 'flex', marginTop: 30}}>
        <button onClick={() => removeAvatarHandler()}>Удалить аватар</button>
        <input
            style={{marginLeft: 15}}
            accept='image/*'
            onChange={e => changeHandler(e)}
            type="file"
            placeholder="Загрузить аватар"/>
      </div>
  )
}

export default Profile
