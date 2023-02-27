import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createDir } from '../../actions/file'
import { setPopupDisplay } from '../../reducers/fileReducer'
import Input from '../../utils/input/Input'

const Popup = () => {
    const [ dirName, setDirName ] = useState( '' )
    const popupDisplay = useSelector( state => state.files.popupDisplay )
    const currentDir = useSelector( state => state.files.currentDir )
    const dispatch = useDispatch()

    const createHandler = () => {
        dispatch( createDir( currentDir, dirName ) )
        dispatch( setPopupDisplay('none'))
        setDirName('')
    }

    return (
        <div
            className="popup"
            style={ { display: popupDisplay } }
            onClick={ () => dispatch( setPopupDisplay( 'none' ) ) }
        >
            <div
                className="popup__content"
                onClick={ e => e.stopPropagation() }
            >
                <div className="popup__header">
                    <div className="popup__title">
                        Создать новую папку
                    </div>
                    <button
                        className="popup__close"
                        onClick={ () => dispatch( setPopupDisplay( 'none' ) ) }
                    >
                        X
                    </button>
                </div>
                <Input value={ dirName }
                       setValue={ setDirName }
                       type="text"
                       placeholder="Введите название папки..."
                />
                <button
                    className="popup__create"
                    onClick={ () => createHandler() }
                >
                    Создать
                </button>
            </div>

        </div>
    )
}

export default Popup
