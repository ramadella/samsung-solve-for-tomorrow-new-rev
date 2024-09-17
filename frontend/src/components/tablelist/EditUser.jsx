import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import backgroundImage from '../../assets/images/background.png'; // Update the path to your image

const EditUser = () => {
    const [name, setName] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [image, setImage] = useState(null);
    const [color, setColor] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch user data by ID
    const getUserById = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/users/${id}`);
            setName(response.data.name);
            setLatitude(response.data.latitude);
            setLongitude(response.data.longitude);
            setColor(response.data.color);
            // Update image preview if image exists
            if (response.data.image) {
                setImagePreview(`http://localhost:5000/public/images/${response.data.image}`);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }, [id]);

    useEffect(() => {
        getUserById();
    }, [getUserById]);

    // Handle form submission for updating user data
    const updateUser = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        if (name) formData.append('name', name);
        if (latitude) formData.append('latitude', latitude);
        if (longitude) formData.append('longitude', longitude);
        if (color) formData.append('color', color);
        if (image) formData.append('image', image); // Add image to formData if it exists

        try {
            const response = await axios.patch(`http://localhost:5000/users/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Update response:', response);
            navigate('/');
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    // Handle image change and update the preview
    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // Update image preview to the new image
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // Handle cancel action to go back to the home page
    const handleCancel = () => {
        navigate('/data');
    };

    return (
        <div style={{
            minHeight: '100vh',
            padding: '2rem',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed', // Fix the background image in place
        }}>
            <div className="columns mt-5 is-centered">
                <div className="column is-half">
                    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        <h1 className="title" style={{ color: '#ffffff', fontSize: '2.5rem' }}>EDIT TRASH DATA</h1>
                    </div>
                    <div className="box" style={{
                        background: 'rgba(60, 30, 84, 0.8)', // Darker purple for the form background
                        padding: '2rem',
                        borderRadius: '8px',
                        border: '2px solid rgba(74, 31, 84, 1.0)' // Full opacity border
                    }}>
                        <form onSubmit={updateUser}>
                            <div className="field">
                                <label className="label" style={{ color: '#ffffff' }}>Name</label>
                                <div className="control">
                                    <input
                                        type="text"
                                        className="input"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Name"
                                        style={{ backgroundColor: '#4A1F54', color: '#ffffff', borderColor: '#4A1F54' }} // Matching input background and border
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
                                        style={{ backgroundColor: '#4A1F54', color: '#ffffff', borderColor: '#4A1F54' }}
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
                                        style={{ backgroundColor: '#4A1F54', color: '#ffffff', borderColor: '#4A1F54' }}
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label" style={{ color: '#ffffff' }}>Color</label>
                                <div className="control">
                                    <div className="select" style={{ backgroundColor: '#4A1F54', color: '#ffffff' }}>
                                        <select
                                            value={color}
                                            onChange={(e) => setColor(e.target.value)}
                                            style={{ backgroundColor: '#4A1F54', color: '#ffffff' }}
                                        >
                                            <option value="" style={{ color: '#000000' }}>Select a color</option>
                                            <option value="red" style={{ color: '#FF0000' }}>Red</option>
                                            <option value="orange" style={{ color: '#FFA500' }}>Orange</option>
                                            <option value="yellow" style={{ color: '#FFFF00' }}>Yellow</option>
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
                                        style={{ backgroundColor: '#4A1F54', color: '#ffffff', borderColor: '#4A1F54' }}
                                    />
                                    {imagePreview && (
                                        <div style={{ marginTop: '1rem' }}>
                                            <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', border: '1px solid #ffffff' }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="field">
                                <div className="control">
                                    <button type="submit" className="button" style={{ backgroundColor: '#5BC0BE', borderColor: '#5BC0BE', color: '#ffffff' }}>
                                        Update
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

export default EditUser;
