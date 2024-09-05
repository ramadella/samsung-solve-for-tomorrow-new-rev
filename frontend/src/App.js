import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserList from "./components/UserList";
import AddUser from './components/AddUser';
import CustomMap from './components/CustomMap';
import EditUser from './components/EditUser';
import WasteImageUpload from './components/WasteType';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<UserList/>}/>
        <Route path='/add' element={<AddUser/>}/>
        <Route path='/edit/:id' element={<EditUser/>}/>
        <Route path='/map' element={<CustomMap/>}/>
        <Route path="/waste-upload" element={<WasteImageUpload />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
