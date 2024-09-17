import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/images/background.png';

const AddUser = () => {
    const [name, setName] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [image, setImage] = useState(null);
    const [color, setColor] = useState("");
    const navigate = useNavigate();

    const saveUser = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        formData.append('image', image);
        formData.append('color', color);

        try {
            await axios.post('http://localhost:5000/users', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div style={{
            minHeight: '100vh',
            padding: '2rem',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }}>
            <div className="columns mt-5 is-centered">
                <div className="column is-half">
                    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        <h1 className="title" style={{ color: '#fe5704', fontSize: '2.5rem' }}>ADD TRASH DATA</h1>
                    </div>
                    <div className="box" style={{ 
                        background: 'rgba(0, 0, 0, 0.7)', // Dark background to match table
                        padding: '2rem', 
                        borderRadius: '8px',
                        border: '2px solid rgba(255, 255, 255, 0.5)' // Border to match the table
                    }}>
                        <form onSubmit={saveUser}>
                            <div className="field">
                                <label className="label" style={{ color: '#ffffff' }}>Name</label>
                                <div className="control">
                                    <input
                                        type="text"
                                        className="input"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Name"
                                        style={{ backgroundColor: '#2c3e50', color: '#ffffff' }} // Adjusted to match the table
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label" style={{ color: '#ffffff' }}>Latitude</label>
                                <div className="control">
                                    <input
                                        type="text"
                                        className="input"
                                        value={latitude}
                                        onChange={(e) => setLatitude(e.target.value)}
                                        placeholder="Latitude"
                                        style={{ backgroundColor: '#2c3e50', color: '#ffffff' }} // Adjusted to match the table
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label" style={{ color: '#ffffff' }}>Longitude</label>
                                <div className="control">
                                    <input
                                        type="text"
                                        className="input"
                                        value={longitude}
                                        onChange={(e) => setLongitude(e.target.value)}
                                        placeholder="Longitude"
                                        style={{ backgroundColor: '#2c3e50', color: '#ffffff' }} // Adjusted to match the table
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label" style={{ color: '#ffffff' }}>Color</label>
                                <div className="control">
                                    <div className="select" style={{ backgroundColor: '#2c3e50' }}>
                                        <select
                                            value={color}
                                            onChange={(e) => setColor(e.target.value)}
                                            style={{ backgroundColor: '#2c3e50', color: '#ffffff' }} // Set color to match input fields
                                        >
                                            <option value="" style={{ backgroundColor: '#2c3e50', color: '#ffffff' }}>Select a color</option>
                                            <option value="red" style={{ backgroundColor: '#2c3e50', color: '#e74c3c' }}>Red</option>
                                            <option value="orange" style={{ backgroundColor: '#2c3e50', color: '#e67e22' }}>Orange</option>
                                            <option value="yellow" style={{ backgroundColor: '#2c3e50', color: '#f1c40f' }}>Yellow</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label" style={{ color: '#ffffff' }}>Image</label>
                                <div className="control">
                                    <input
                                        type="file"
                                        className="input"
                                        onChange={handleImageChange}
                                        style={{ backgroundColor: '#2c3e50', color: '#ffffff' }} // Adjusted to match the table
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <div className="control">
                                    <button type="submit" className="button is-success" style={{ backgroundColor: '#fe5704', borderColor: '#fe5704' }}>
                                        Save
                                    </button>
                                    <button type="button" className="button is-light ml-2" onClick={handleCancel} style={{ backgroundColor: '#BDC3C7', color: '#000000' }}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddUser;
