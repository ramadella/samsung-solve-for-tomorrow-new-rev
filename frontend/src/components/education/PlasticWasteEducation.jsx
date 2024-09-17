import React, { useState } from 'react';
import { FaRecycle, FaTrashAlt, FaBurn } from 'react-icons/fa';
import { GiFire } from 'react-icons/gi';
import Dashboard from '../dashboard';

const layoutContainerStyle = {
  display: 'flex',
  flexDirection: 'row',
  height: '100vh',
  margin: 0,
  padding: 0,
};

const contentContainerStyle = {
  flex: 1,
  padding: '20px',
  overflowY: 'auto',
  backgroundColor: '#f8f9fa',
};

const sectionStyle = {
  marginLeft: '200px', 
  marginBottom: '20px',
  padding: '20px', 
  backgroundColor: '#fff',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const textStyle = {
  textAlign: 'justify',
  color: '#4a4a4a',
};

const titleStyle = {
  textAlign: 'center',
  marginLeft: '200px',
  marginRight: 'auto', 
  width: '80%',
  color: '#333',
};

const buttonStyle = {
  backgroundColor: '#3273dc',
  color: '#fff',
  border: 'none',
  padding: '10px 15px',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '10px',
  transition: 'background-color 0.3s ease',
};

const buttonHoverStyle = {
  backgroundColor: '#276cda',
};

const PlasticWasteEducation = () => {
  const [showMore, setShowMore] = useState({});
  const [hover, setHover] = useState({});

  const handleToggle = (section) => {
    setShowMore((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleMouseEnter = (section) => {
    setHover((prev) => ({ ...prev, [section]: true }));
  };

  const handleMouseLeave = (section) => {
    setHover((prev) => ({ ...prev, [section]: false }));
  };

  const createSection = (title, icon, content) => {
    const shortContent = content.slice(0, 200) + '...';
    const fullContent = content;

    return (
      <section className="box" style={sectionStyle}>
        <h2 className="subtitle" style={{ display: 'flex', alignItems: 'center' }}>
          {icon} <strong style={{ marginLeft: '10px' }}>{title}</strong>
        </h2>
        <p style={textStyle}>
          {showMore[title] ? fullContent : shortContent}
        </p>
        <button
          className="button is-link"
          style={{
            ...buttonStyle,
            ...(hover[title] ? buttonHoverStyle : {}),
          }}
          onClick={() => handleToggle(title)}
          onMouseEnter={() => handleMouseEnter(title)}
          onMouseLeave={() => handleMouseLeave(title)}
        >
          {showMore[title] ? 'Show Less' : 'Click for more info'}
        </button>
      </section>
    );
  };

  return (
    <div style={layoutContainerStyle}>
      <Dashboard activeItem="PlasticWasteEducation" />
      <div style={contentContainerStyle}>
        <div className="columns is-centered">
          <div className="column is-10">
            <h1 className="title" style={titleStyle}>
              Plastic Waste Education and Pyrolysis Benefits
            </h1>

            {createSection(
              'What is Plastic Waste?',
              <FaTrashAlt className="icon has-text-danger" />,
              'Plastic waste is a growing environmental issue that affects ecosystems, wildlife, and human health. It consists of discarded plastic products that take hundreds of years to decompose. Single-use plastics, in particular, are a major contributor. Marine life often mistakes plastic for food, leading to fatalities. As plastic waste breaks down, microplastics infiltrate our oceans, soil, and even the air we breathe. This crisis demands immediate attention and responsible management. The key question is: can we change our habits in time to protect the planet?'
            )}

            {createSection(
              'Importance of Recycling',
              <FaRecycle className="icon has-text-success" />,
              'Recycling is essential in reducing the impact of plastic waste on our environment. By recycling, we conserve natural resources, save energy, and reduce the amount of plastic that ends up in landfills or oceans. Proper recycling also helps reduce greenhouse gas emissions, combating climate change. Imagine the potential of every recycled bottle: it could be transformed into new products, from clothing to building materials. With more awareness and participation, recycling can lead to a cleaner and more sustainable world.'
            )}

            {createSection(
              'What is Pyrolysis?',
              <GiFire className="icon has-text-warning" />,
              'Pyrolysis is an innovative method that transforms plastic waste into useful resources. Unlike incineration, which burns waste and releases harmful emissions, pyrolysis heats plastics in the absence of oxygen. This process breaks down the materials into liquid fuel, gas, and char. These products can be repurposed as energy sources, reducing our reliance on fossil fuels. Pyrolysis is particularly valuable for non-recyclable plastics, offering a sustainable solution to the global plastic waste problem.'
            )}

            {createSection(
              'Benefits of Pyrolysis',
              <FaBurn className="icon has-text-info" />,
              'Pyrolysis provides a sustainable way to tackle plastic waste. By converting waste into energy, it reduces the volume of plastics in landfills and oceans. Additionally, it produces cleaner energy, with fewer harmful emissions compared to traditional incineration. Pyrolysis also addresses the challenge of mixed or contaminated plastics that are not suitable for traditional recycling. This technology not only helps mitigate the plastic crisis but also contributes to the global shift towards renewable energy sources.'
            )}

            {createSection(
              'How to Manage Plastic Waste?',
              <FaTrashAlt className="icon has-text-danger" />,
              'Managing plastic waste requires collective action. We need to reduce our reliance on single-use plastics, reuse products when possible, and recycle materials correctly. Governments and industries must invest in waste management technologies like pyrolysis and promote eco-friendly alternatives. Public awareness campaigns play a crucial role in changing consumer behavior. Together, through education and innovation, we can reduce the environmental footprint of plastic waste and create a cleaner future for all.'
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlasticWasteEducation;
