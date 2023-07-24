import { useState } from 'react';
import './Form.scss';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export const Form = () => {

    const [image, setImage] = useState({})
    const [state, setState] = useState({
        isDragging: false,
        isUploaded: false,
        imageFile: {},
        errorMessage: '',
        success: Boolean,
    })

    const handleChange = (e) => {
        setImage(URL.createObjectURL(e.target.files[0]));
        setState({
            isUploaded: true,
            imageFile: e.target.files[0]
        })
    }

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const img = e.dataTransfer.files[0]
        if (e.dataTransfer.files && e.dataTransfer.files.length <= 1) {
            setImage(URL.createObjectURL(img));
            setState(p => ({
                ...p,
                success: true,
                isDragging: false,
                isUploaded: true,
                imageFile: img
            }))
        } else {
            handleCancel()
            setState(p => ({
                ...p,
                success: false,
                errorMessage: 'Only a single image file can be uploaded',
            }))
            return
        }


    }

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setState(p => ({
            ...p,
            isDragging: true
        }))
    }

    const handleDragOut = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setState(p => ({
            ...p,
            isDragging: false
        }))
    }

    const handleCancel = () => {
        setImage({});
        setState({
            isUploaded: false,
            imageFile: {}
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setState(p => ({
            ...p,
            isUploaded: true
        }))
        const { imageFile } = state
        console.log(imageFile)
    }

  return (
    
      <div className='content'>
          <h2>Upload your image</h2>
          <p>Acceptable file format (.jpeg, .png, etc.)</p>

          <form
              onSubmit={handleSubmit}
              onDragOver={handleDragOver}
              onDragLeave={handleDragOut}
              onDrop={handleDrop}
              className='form'>
              <input
                  id='image'
                  name='image'
                  type='file'
                  accept='image/*'
                  onChange={handleChange}
              />
              <label
                  className={`${state.isDragging && 'dropImage'}`}
                  htmlFor='image'
              >
                  {state.isUploaded
                      &&
                      <img
                          src={image}
                          alt={state.imageFile.name}
                      />}
                  {!state.isUploaded
                      ?
                      <>
                          <CloudUploadIcon className='icon' />
                          {state.isDragging
                              ? 'Drop image here' :
                              `Click here to choose your file, or drag it here`}
                      </>
                      :
                      state.imageFile.name
                  }
              </label>

              <div className='btns'>
                  <button>Upload</button>
                  <button type='button' onClick={handleCancel}>Cancel</button>
              </div>
          </form>
          {
              !state.success
              &&
              <p className='error'>{state.errorMessage}</p>
          }
      </div>
  )
}
