import { Routes, Route, BrowserRouter } from 'react-router-dom';

import Root from './Root.tsx';
import Variables from './Variables.tsx';

function App() {
  return (
    <BrowserRouter basename="/reactjs-vin-decoder">
      <Routes>
        <Route path='/' element={<Root />}/>
        <Route path='/variables' element={<Variables />}/>
        <Route path="/variables/:variableId" element={<Variables />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
