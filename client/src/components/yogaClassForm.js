import React, { useState } from 'react';
import axios from 'axios'; // You'll need to install axios for making API requests
import './yogaClassForm.css'
import yogaImage from '../image/yogaimage.png';


const YogaClassForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    selectedBatch: '',
  });
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/enroll', formData);
      console.log('Response:', response.data); 
      setShowPopup(true); 
    } catch (error) {
      console.error('Error:', error);
      
    }
  };
  const handleClosePopup = () => {
    setShowPopup(false); 
    setFormData({ 
        name: '',
        age: '',
        selectedBatch: '',
      });
  };

  return (
    <div className="outer-container"> 
    <div className="form-container">
      <h2>Yoga Class Admission Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input className='inputdata'
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="age">Age:</label>
          <input className='inputdata'
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="selectedBatch">Select Batch:</label>
          <select className='inputdata'
            id="selectedBatch"
            name="selectedBatch"
            value={formData.selectedBatch}
            onChange={handleChange}
            required
          >
            <option value="">Select Batch</option>
            <option value="6-7AM">6-7AM</option>
            <option value="7-8AM">7-8AM</option>
            <option value="8-9AM">8-9AM</option>
            <option value="5-6PM">5-6PM</option>
          </select>
        </div>
        <button type="submit">Enroll</button>
      </form>
      </div>
      <div className="image-container">
        <img src={yogaImage} alt="Yoga" />
      </div>
      {showPopup && (
        <div className="popup-container">
        <div className="popup-box">
        <button className="close-btn" onClick={handleClosePopup}></button>
        <p className='popup-message'>Your registration has been successful!</p>
          
        </div>
        </div>
      )}
    </div>
  );
};

export default YogaClassForm;
