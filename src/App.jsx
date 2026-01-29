import { useState } from 'react'
import AhsaasStar from './components/AhsaasStar'
import StephStar from './components/StephStar'
import MichaelStar from './components/MichaelStar'
import './App.css'

function App() {
  return (
    <div className="canvas">
      <div className="star-container ahsaas-position">
        <AhsaasStar />
      </div>
      <div className="star-container steph-position">
        <StephStar />
      </div>
      <div className="star-container michael-position">
        <MichaelStar />
      </div>
    </div>
  )
}

export default App
