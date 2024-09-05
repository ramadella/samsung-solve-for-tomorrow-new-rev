import React, { useState, useEffect } from 'react';
import 'bulma/css/bulma.min.css';
import unandLogo from '../assets/images/unand.png';
import samsungLogo from '../assets/images/samsung.png';
import rubbishLogo from '../assets/images/rubbish.png';
import samsungSolveForTomorrowLogo from '../assets/images/samsung-solve-for-tomorrow.png';

// Function to handle image upload
const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response = await fetch('http://127.0.0.1:5000/upload_image', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to upload image. ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
        throw error;
    }
};

// Main component
const WasteImageUpload = () => {
    const [wasteData, setWasteData] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Cleanup object URL to prevent memory leaks
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedImage) {
            alert('Please select an image first.');
            return;
        }
    
        setIsLoading(true);
    
        try {
            // First, upload the image
            await uploadImage(selectedImage);
    
            // Then, fetch the detected waste data from the Flask backend
            const response = await fetch('http://127.0.0.1:5000/get_waste_data');
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch waste data. ${errorText}`);
            }
            const data = await response.json();
    
            if (data && data.detected_objects) {
                setWasteData(data.detected_objects);
            } else {
                alert('No detected objects returned.');
                setWasteData([]);
            }
        } catch (error) {
            console.error('Error during upload and fetch:', error);
        } finally {
            setIsLoading(false);
        }
    };
    

    const imageStyle = {
        maxWidth: '120px',
        height: 'auto',
        margin: '0 5px',
    };

    return (
        <section className="section has-background-primary">
            <div className="container" style={{ backgroundColor: '#e0e0e0', padding: '20px', borderRadius: '8px' }}>
                <div className="columns is-centered is-flex is-align-items-stretch">
                    <div className="column is-half">
                        <div className="box has-background-white" style={{ height: '100%' }}>
                            <h1 className="title is-3 has-text-centered has-text-primary">Waste Type Detection</h1>
                            <div className="file has-name is-fullwidth">
                                <label className="file-label">
                                    <input
                                        className="file-input"
                                        type="file"
                                        accept=".jpg, .jpeg, .png"
                                        onChange={handleImageChange}
                                    />
                                    <span className="file-cta">
                                        <span className="file-icon">
                                            <i className="fas fa-upload"></i>
                                        </span>
                                        <span className="file-label">Choose an image…</span>
                                    </span>
                                    {selectedImage && <span className="file-name">{selectedImage.name}</span>}
                                </label>
                            </div>
                            {imagePreview && (
                                <div className="image-preview mt-4">
                                    <figure className="image is-4by3">
                                        <img src={imagePreview} alt="Selected" />
                                    </figure>
                                </div>
                            )}
                            <button
                                className="button is-primary is-fullwidth mt-4"
                                onClick={handleUpload}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Uploading...' : 'Upload and Detect'}
                            </button>
                        </div>
                    </div>
                    <div className="column is-half">
                        <div className="box has-background-white" style={{ height: '100%' }}>
                            <h2 className="title is-4 has-text-centered">Detected Waste</h2>
                            {wasteData.length > 0 ? (
                                <div className="content mt-4">
                                    <ul>
                                        {wasteData.map((waste) => (
                                            <li key={waste.id} style={{ marginBottom: '15px' }}>
                                                <div className="columns is-mobile is-vcentered">
                                                    <div className="column is-narrow">
                                                        <img
                                                            src={waste.image_url}
                                                            alt={waste.name}
                                                            style={imageStyle}
                                                        />
                                                    </div>
                                                    <div className="column">
                                                        <p className="title is-5">{waste.name}</p>
                                                        <p>{waste.description}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p className="has-text-centered">No waste detected. Please upload another image.</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="has-text-centered mt-5">
                    <img src={unandLogo} alt="Unand Logo" style={{ maxWidth: '100px', margin: '0 10px' }} />
                    <img src={samsungLogo} alt="Samsung Logo" style={{ maxWidth: '100px', margin: '0 10px' }} />
                    <img src={rubbishLogo} alt="Rubbish Logo" style={{ maxWidth: '100px', margin: '0 10px' }} />
                    <img src={samsungSolveForTomorrowLogo} alt="Samsung Solve for Tomorrow Logo" style={{ maxWidth: '100px', marginBottom: '20px' }} />
                </div>
            </div>
        </section>
    );
};

export default WasteImageUpload;
