import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFiles, uploadFile } from '../../actions/file'
import { setCurrentDir, setFileView, setPopupDisplay } from '../../reducers/fileReducer'
import './disk.less'
import FileList from './fileList/FileList'
import Popup from './Popup'
import Uploader from './uploader/Uploader'

const Disk = () => {
  const dispatch = useDispatch()
  const currentDir = useSelector(state => state.files.currentDir)
  const dirStack = useSelector(state => state.files.dirStack)
  const loader = useSelector(state => state.app.loader)
  const [ dragEnter, setDragEnter ] = useState(false)
  const [ sort, setSort ] = useState('type')

  useEffect(() => {
    dispatch(getFiles(currentDir, sort))
  }, [ currentDir, dispatch, sort ])

  function showPopupHandler() {
    dispatch(setPopupDisplay('flex'))
  }

  function backClickHandler() {
    const backDirId = dirStack.pop()
    dispatch(setCurrentDir(backDirId))
  }

  function fileUploadHandler(event) {
    const files = [ ...event.target.files ]
    files.forEach(file => dispatch(uploadFile(file, currentDir)))
  }

  function dragEnterHandler(e) {
    e.preventDefault()
    e.stopPropagation()
    setDragEnter(true)
  }

  function dragLeaveHandler(e) {
    e.preventDefault()
    e.stopPropagation()
    setDragEnter(false)
  }

  function dropHandler(e) {
    e.preventDefault()
    e.stopPropagation()
    let files = [ ...e.dataTransfer.files ]
    files.forEach(file => dispatch(uploadFile(file, currentDir)))
    setDragEnter(false)
  }

  if(loader) {
    return (
        <div className="loader">
          <div className="lds-circle">
            <div></div>
          </div>
        </div>
    )
  }


  return (!dragEnter
          ?
          <div className="disk"
               onDragEnter={dragEnterHandler}
               onDragLeave={dragLeaveHandler}
               onDragOver={dragEnterHandler}
          >
            <div className="disk__btns">
              <div className="disk__left-btn-box">
                <button className="disk__back" onClick={() => backClickHandler()}>Назад</button>
                <button className="disk__create" onClick={() => showPopupHandler()}>Создать папку</button>

                <div className="disk__upload">
                  <label htmlFor="disk__upload-input" className="disk__upload-label">Загрузить файл</label>
                  <input
                      multiple={true}   // несколько файлов
                      onChange={(event) => fileUploadHandler(event)}
                      type="file"
                      className="disk__upload-input"
                      id="disk__upload-input"
                  />
                </div>
              </div>
              <div className='disk__right-btn-box'>
                <select value={sort}
                        className="disk__select"
                        onChange={event => setSort(event.target.value)}
                >
                  <option value="name">По имени</option>
                  <option value="type">По типу</option>
                  <option value="date">По дате</option>
                </select>

                <button className="disk__plate" onClick={()=>dispatch(setFileView('plate'))}/>
                <button className="disk__list" onClick={()=>dispatch(setFileView('list'))}/>
              </div>
            </div>

            <FileList/>
            <Popup/>
            <Uploader/>
          </div>
          :
          <div className="drop-area"
               onDrop={dropHandler}
               onDragEnter={dragEnterHandler}
               onDragLeave={dragLeaveHandler}
               onDragOver={dragEnterHandler}
          >
            Перетащите файлы сюда
          </div>
  )
}

export default Disk
