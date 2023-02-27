import React from 'react'
import { useSelector } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import File from './file/File'
import './fileList.less'

const FileList = () => {

  const files = useSelector(state => state.files.files)
  const fileView = useSelector(state => state.files.view)
// const files = [{_id: 1, name: 'direct', type: 'dir', size: '5gb', data: '20.02.2020'},
//     {_id: 2, name: 'direct-2', type: 'file', size: '15gb', data: '10.07.2022'}].map(file => (
//         <File key={file._id} file={file}/>
// ))
  if(!files.length) {
    return <h3 className="loader">Файлы не найдены</h3>
  }

  if(fileView === 'plate') {
    return (
        <div className="filePlate">

          {files?.map(file =>
              <File key={file._id} file={file}/>
          )}

        </div>
    )
  }

  if(fileView === 'list') {
    return (
        <div className="fileList">
          <div className="fileList__header">
            <div className="fileList__name">Название</div>
            <div className="fileList__date">Дата</div>
            <div className="fileList__size">Размер</div>
          </div>
          <TransitionGroup>
            {files?.map(file =>
                <CSSTransition
                    key={file._id}
                    timeout={1500}
                    className={'file'}
                    exit={false}
                >
                  <File file={file}/>
                </CSSTransition>
            )}
          </TransitionGroup>

        </div>
    )
  }


}

export default FileList
