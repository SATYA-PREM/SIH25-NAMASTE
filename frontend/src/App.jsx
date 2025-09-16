import { useEffect } from 'react'
import Endpoint from './routes/Route'
import './App.css'

function App() {
  useEffect(() => {
    console.log('App mounted')
  }, [])
  return (
    <>
      <Endpoint />
    </>
  )
}

export default App
