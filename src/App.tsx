import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Login_form} from './register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {Approved} from './api/Dashboard';
import {NotApproved} from './api/Dashboard';
import Training from './api/Training';
function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element = {<Login_form />} />
      <Route path='/dashboard/approved' element = {<Approved/>} />
      <Route path='/dashboard/not-approved' element = {<NotApproved/>} />
      <Route path='/Training' element={<Training/>} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
