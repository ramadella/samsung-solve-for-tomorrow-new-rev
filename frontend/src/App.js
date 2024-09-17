import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddUser from './components/tablelist/AddUser';
import CustomMap from './components/map/CustomMap';
import EditUser from './components/tablelist/EditUser';
import DashboardDesaign from './components/chart/dashboarDesaign';
import Data from './components/tablelist/data';
import CameraFeed from './components/classification/CameraCapture';
import OrdersDashboard from './components/customers/OrderDashboard';
import PlasticWasteEducation from './components/education/PlasticWasteEducation';
import WasteClassificationComponent from './components/ga/WasteClassificationComponent';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<DashboardDesaign/>}/>
        <Route path='/data' element={<Data/>}/>
        <Route path='/add' element={<AddUser/>}/>
        <Route path='/edit/:id' element={<EditUser/>}/>
        <Route path='/map' element={<CustomMap/>}/>
        <Route path="/camera-feed" element={<CameraFeed/>} />
        <Route path="/customers" element={<OrdersDashboard/>} />
        <Route path="/education" element={<PlasticWasteEducation/>} />
        <Route path='/fuel-prediction' element= {<WasteClassificationComponent/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
