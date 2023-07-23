import { useState } from 'react';
import './App.scss';

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
            <img
              src={image}
              alt={image.name}
            />
            {!state.isUploaded
             ?
              'Click here to choose your file'
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
