import { useState } from 'react';
import './App.scss';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function App() {

  const [image, setImage] = useState({})
  const [state, setState] = useState({
    isUploaded: false,
    imageFile: {}
  })

  const handleChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
    setState({
      isUploaded: true,
      imageFile: e.target.files[0]
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setState(p => ({
      ...p,
      isUploaded: true
    }))
    const {imageFile} = state
    console.log(imageFile)
  }

  return (
    <div className="App">
      <div className='content'>
        <h2>Upload your image</h2>
        <p>Acceptable file format (.jpeg, .png, etc.)</p>

        <form onSubmit={handleSubmit} className='form'>
          <input
          id='image'
          name='image'
          type='file'
          accept='image/*'
          onChange={handleChange}
          />
          <label htmlFor='image'>
           {state.isUploaded 
            &&
             <img
              src={image}
              alt={state.imageFile.name}
            />}
            {!state.isUploaded
             ?
             <>
             <CloudUploadIcon className='icon'/>
              Click here to choose your file, or drag it here
              </>
              :
              state.imageFile.name
              }
            </label>

          <button>Submit</button>
        </form>

      </div>
    </div>
  );
}

export default App;
