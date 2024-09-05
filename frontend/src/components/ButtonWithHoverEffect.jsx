import React, { useState } from 'react';

const ButtonWithHoverEffect = ({ children, baseColor, hoverColor, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        if (!isClicked) {
            setIsHovered(false);
        }
    };

    const handleMouseDown = () => {
        setIsClicked(true);
    };

    const handleMouseUp = () => {
        setIsClicked(false);
        if (!isHovered) {
            setIsClicked(false);
        }
    };

    const buttonStyle = {
        display: 'inline-block',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '5px',
        border: '1.5px solid #d12bec',
        color: '#fff',
        zIndex: 1,
        letterSpacing: '0.8px',
        background: baseColor,
        cursor: 'pointer',
        padding: '0.5rem 1rem',
        textAlign: 'center',
        textDecoration: 'none',
        fontSize: '1rem',
        transition: 'background 0.3s ease-in',
    };

    const beforeStyle = {
        content: '""',
        position: 'absolute',
        width: '100%',
        height: '100%',
        transition: 'all 0.3s ease-in',
        background: isHovered || isClicked ? hoverColor : baseColor,
        zIndex: -1,
        top: 0,
        right: 0,
        borderRadius: '5px',
        transform: isHovered || isClicked ? 'scale(1.1)' : 'scale(1)',
    };

    return (
        <div
            style={buttonStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onClick={onClick}
        >
            <div style={beforeStyle}></div>
            {children}
        </div>
    );
};

export default ButtonWithHoverEffect;