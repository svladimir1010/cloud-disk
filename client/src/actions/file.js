import axios from 'axios'
import { API_URL } from '../config'
import { hideLoader, showLoader } from '../reducers/appReducer'
import { addFile, deleteFileAction, setFiles } from '../reducers/fileReducer'
import { addUploadFile, changeUploadFile, showUploader } from '../reducers/uploadReducer'

export function getFiles(dirId, sort = 'type') {
  return async dispatch => {

    try {
      dispatch(showLoader())
      let url = `${API_URL}api/files`

      if(!dirId) {
        url = url + `?sort=${sort}`
      }
      if(dirId && sort) {
        url = url + `?parent=${dirId}&sort=${sort}`
      }
      const response = await axios.get(url, {
        headers: {authorization: `Bearer ${localStorage.getItem('token')}`}
      })
      dispatch(setFiles(response.data))
    } catch( e ) {
      console.log(e.message)
      alert(e?.response?.data?.message)
    } finally {
      dispatch(hideLoader())
    }
  }
}

export function createDir(dirId, name) {

  return async dispatch => {
    try {
      const response = await axios.post(`${API_URL}api/files`, {
        name,
        parent: dirId,
        type: 'dir'
      }, {
        headers: {authorization: `Bearer ${localStorage.getItem('token')}`}
      })
      dispatch(addFile(response.data))
    } catch( e ) {
      alert(e?.response?.data?.message)
    }
  }
}

export function uploadFile(file, dirId) {
  return async dispatch => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      if(dirId) {
        formData.append('parent', dirId)
      }
      const uploadFile = {name: file.name, progress: 0, id: Date.now()}
      dispatch(showUploader())
      dispatch(addUploadFile(uploadFile))
      const response = await axios.post(`${API_URL}api/files/upload`, formData, {
        headers: {authorization: `Bearer ${localStorage.getItem('token')}`},

        onUploadProgress: progressEvent => {
          const {loaded, total} = progressEvent
          if(total) {
            uploadFile.progress = Math.floor((loaded * 100) / total)
            dispatch(changeUploadFile(uploadFile))
          }
        }
      })
      dispatch(addFile(response.data))
    } catch( e ) {
      console.log(e.message)
      alert(e?.response?.data?.message)
    }
  }
}

export async function downloadFile(file) {
  console.log('downloading file')
  const response = await fetch(`${API_URL}api/files/download?id=${file._id}`, {
    headers: {authorization: `Bearer ${localStorage.getItem('token')}`},
  })
  if(response.status === 200) {
    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    link.remove()
  } else {
    console.log('error')
  }
}

export function deleteFile(file) {
  return async dispatch => {
    try {
      const response = await axios.delete(`${API_URL}api/files?id=${file._id}`, {
        headers: {authorization: `Bearer ${localStorage.getItem('token')}`},
      })
      console.log('deleteFile action: ', response.data)
      dispatch(deleteFileAction(file._id))
      alert(response.data.message)
    } catch( e ) {
      alert(e?.response?.data?.message)
    }
  }
}

export function searchFiles(search) {
  return async dispatch => {
    try {
      const response = await axios.get(`${API_URL}api/files/search?search=${search}`, {
        headers: {authorization: `Bearer ${localStorage.getItem('token')}`},
      })
      dispatch(setFiles(response.data))
    } catch( e ) {
      alert(e?.response?.data?.message)
    } finally {
      dispatch(hideLoader())
    }
  }
}


