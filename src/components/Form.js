import { useState } from 'react';
import './Form.scss';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Uploading } from './Uploading';
import copy from 'copy-to-clipboard'

export const Form = () => {

    const imagesExtension = ["png", "jpg", "jpeg"];
    const [image, setImage] = useState({})
    const [state, setState] = useState({
        isDragging: false,
        isUploaded: false,
        imageFile: {},
        errorMessage: '',
        isUploading: false,
        success: false,
        requested: null,
        responseLink: ''
    })

    const checkFileType = (fileName) => {
        const fileExtension = fileName.replace(/^.*\./, '');
        if (imagesExtension.indexOf(fileExtension) !== -1) {
            return true;
        } else {
            return false;
        }
    }

    const handleChange = (e) => {
        const fileName = e.target.files[0].name
        if (!checkFileType(fileName) || e.target.files.length !== 1) {
            handleCancel()
            setState(p => ({
                ...p,
                success: true,
                errorMessage: 'Only a single image file can be uploaded',
            }))
            return
        }
        setImage(URL.createObjectURL(e.target.files[0]));
        setState(p => ({
            ...p,
            isUploaded: true,
            success: false,
            imageFile: e.target.files[0]
        }))
    }

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const fileName = e.dataTransfer.files[0].name
        const img = e.dataTransfer.files[0]

        if (!checkFileType(fileName) || e.dataTransfer.files.length !== 1) {
            handleCancel()
            setState(p => ({
                ...p,
                success: true,
                errorMessage: 'Only a single image file can be uploaded',
            }))
            return
        }
        setImage(URL.createObjectURL(img));
        setState(p => ({
            ...p,
            success: true,
            isDragging: false,
            isUploaded: true,
            imageFile: img
        }))


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

    const handleCopy = (e) => {
        copy(e)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setState(p => ({
            ...p,
            isUploading: true,
        }))

        const cloud_name = process.env.REACT_APP_cloud_name
        const upload_preset = process.env.REACT_APP_upload_preset

        setState(p => ({
            ...p,
            isUploaded: true
        }))

        let formData = new FormData()
        formData.append('file', state.imageFile, state.imageFile.name)
        formData.append("upload_preset", upload_preset);

        const upload = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/upload`, {
            method: "POST",
            body: formData,
        })
        const response = await upload.json()
        if (!response.secure_url) {
            setState(p => ({
                ...p,
                requested: true,
                success: false,
                errorMessage: 'Upload failed!',
                isUploading: false,
            }))
            return
        }
        setState(p => ({
            ...p,
            success: true,
            requested: true,
            errorMessage: 'Image uploaded succesfully',
            responseLink: response.secure_url,
            isUploading: false,
        }))


    }

    return (
        <>
            {
                state.isUploading
                    ?
                    <Uploading />
                    :
                    <div className='content'>
                        <h2>Upload your image</h2>
                        <p>Acceptable file format ({imagesExtension.map((el, i) =>
                            <span key={i}> {el} </span>)})
                        </p>

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
                                className={`${state.isDragging && 'dropImage'} imgSpace`}
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
                            {
                                state.success
                                &&
                                <div
                                    className={`${state.requested && state.success ? 'show' : 'hide'}`}>
                                    <input
                                        id='link'
                                        readOnly
                                        value={state.responseLink}
                                    />
                                    <button onClick={() => handleCopy(state.responseLink)} type='button'>Copy</button>
                                </div>
                            }
                            <div className='btns'>
                                <button disabled={!state.isUploaded ? true : false}>Upload</button>
                                <button type='button' onClick={handleCancel}>Clear</button>
                            </div>
                            {
                                state.requested
                                &&
                                <p className={`${state.requested && state.success ? 'success' : 'error'}`}>{state.errorMessage}</p>
                            }
                        </form>
                    </div>
            }
        </>

    )
}
