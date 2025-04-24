// App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Homepage from './components/Homepage'
import Checkoutpage from './components/Checkoutpage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/checkout/:id" element={<Checkoutpage />} />
    </Routes>
  )
}

export default App
