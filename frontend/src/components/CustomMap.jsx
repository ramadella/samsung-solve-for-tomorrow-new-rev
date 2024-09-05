import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Circle, LayersControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import 'leaflet-routing-machine';
import { useNavigate, useLocation } from 'react-router-dom'; 

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

function GeoSearch() {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: 'button',
      showMarker: true,
      retainZoomLevel: false,
      animateZoom: true,
      autoClose: true,
      searchLabel: 'Enter address',
    });
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, [map]);

  return null;
}

const myIcon = new L.Icon({
  iconUrl: 'http://maps.google.com/mapfiles/ms/icons/realestate.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const RoutingMachine = ({ start, end }) => {
  const map = useMap();

  useEffect(() => {
    if (start && end) {
      const control = L.Routing.control({
        waypoints: [L.latLng(start), L.latLng(end)],
        routeWhileDragging: true,
        lineOptions: {
          styles: [
            { color: 'orange', opacity: 0.8, weight: 6 },
            { color: 'yellow', opacity: 0.5, weight: 4, dashArray: '5, 10' },
            { color: 'red', opacity: 0.7, weight: 2 },
          ],
        },
        createMarker: (i, waypoint, n) => {
          const marker = L.marker(waypoint.latLng, { icon: myIcon });
          if (i === 0) {
            marker.bindTooltip('You are here', {
              permanent: true,
              direction: 'top',
              offset: [0, -45],
              className: 'custom-tooltip',
            }).openTooltip();
          }
          return marker;
        },
      }).addTo(map);

      const style = document.createElement('style');
      style.innerHTML = `
        .custom-tooltip {
          background-color: rgba(0, 0, 0, 0.8) !important;
          color: #fff !important;
          border-radius: 3px !important;
          padding: 5px !important;
          font-size: 12px !important;
          font-family: Arial, sans-serif !important;
          font-weight: bold !important;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3) !important;
        }
      `;
      document.head.appendChild(style);

      return () => {
        map.removeControl(control);
        document.head.removeChild(style);
      };
    }
  }, [start, end, map]);

  return null;
};

const CustomMap = () => {
  const [locations, setLocations] = useState([]);
  const [routeStart, setRouteStart] = useState(null);
  const [routeEnd, setRouteEnd] = useState(null);
  const [highlightedLocation, setHighlightedLocation] = useState(null);
  const fixedMarkerLocation = [-0.9144508673509965, 100.45815739973361];
  const imageUrl = 'http://localhost:5000/public/images/andalas.jpg';

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then(response => {
        setLocations(response.data.users || []);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const lat = parseFloat(queryParams.get('lat'));
    const lng = parseFloat(queryParams.get('lng'));

    if (!isNaN(lat) && !isNaN(lng)) {
      setHighlightedLocation([lat, lng]);
    }
  }, [location.search]);

  const handleGoHereClick = (location) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setRouteStart([latitude, longitude]);
        setRouteEnd([location.latitude, location.longitude]);
      },
      (error) => console.error('Error getting location:', error),
      { enableHighAccuracy: true }
    );
  };

  const getColor = (color) => {
    switch (color) {
      case 'red':
        return 'red';
      case 'orange':
        return 'orange';
      case 'yellow':
        return '#bdbd06';
      default:
        return 'gray';
    }
  };

  const ZoomToLocation = () => {
    const map = useMap();
  
    useEffect(() => {
      if (highlightedLocation) {
        map.setView(highlightedLocation, 15); // Adjust zoom level as needed
      }
    }, [map]);
  
    return null;
  };
  

  return (
    <div className="map-container">
      <button
        onClick={() => navigate('/')} 
        style={{
          position: 'absolute', 
          bottom: '10px', 
          left: '10px',
          padding: '10px 20px',
          background: 'linear-gradient(135deg, #00c6ff, #0072ff)',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 1000, 
        }}
      >
        Home
      </button>
      <MapContainer center={fixedMarkerLocation} zoom={13} style={{ height: '100vh', width: '100%' }}>
        <GeoSearch />
        <ZoomToLocation />
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              url="http://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}"
              maxZoom={20}
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Google Map">
            <TileLayer
              url="http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}"
              maxZoom={20}
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="CartoDB Dark Matter">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              subdomains='abcd'
              maxZoom={20}
            />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay checked name="Fixed Marker">
            <Marker position={fixedMarkerLocation} icon={customIcon}>
              <Popup>
                <h3>UNIVERSITAS ANDALAS</h3>
                <img src={imageUrl} alt="Universitas Andalas" width="150" style={{ borderRadius: '4px' }} />
              </Popup>
            </Marker>
          </LayersControl.Overlay>
          <LayersControl.Overlay checked name="Fixed Circle">
            <Circle
              center={fixedMarkerLocation}
              radius={1500}
              pathOptions={{ color: 'blue', fillColor: '#00f', fillOpacity: 0.5 }}
            />
          </LayersControl.Overlay>
          {locations.length > 0 && locations.map(location => (
            <React.Fragment key={location.id}>
              <Marker position={[location.latitude, location.longitude]} icon={customIcon}>
                <Popup>
                  <h3 style={{ textAlign: 'center' }}>{location.name}</h3>
                  <img
                    src={`http://localhost:5000/public/images/${location.image}`}
                    alt={location.name}
                    width="150"
                    style={{ borderRadius: '4px', display: 'block', margin: 'auto' }}
                  />
                  <button
                    onClick={() => handleGoHereClick(location)}
                    style={{
                      display: 'block',
                      margin: '10px auto',
                      padding: '10px 20px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Go Here
                  </button>
                </Popup>
              </Marker>
              <Circle
                center={[location.latitude, location.longitude]}
                radius={20}
                pathOptions={{ color: getColor(location.color), fillColor: getColor(location.color), fillOpacity: 0.5 }}
              />
            </React.Fragment>
          ))}
          {highlightedLocation && (
            <Circle
              center={highlightedLocation}
              radius={150}
              pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.5 }}
            />
          )}
        </LayersControl>
        <RoutingMachine start={routeStart} end={routeEnd} />
      </MapContainer>
    </div>
  );
};

export default CustomMap;
