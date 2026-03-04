import { Routes, Route } from 'react-router-dom';

import Root from './Root.tsx';
import Variables from './Variables.tsx';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Root />}/>
      <Route path='/variables' element={<Variables />}/>
      <Route path="/variables/:variableId" element={<Variables />} />
    </Routes>
  )
}

export default App
