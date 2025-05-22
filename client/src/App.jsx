import React from 'react'
import AppRouter from './pages/AppRouter'
import "./index.css"
import { Toaster } from 'react-hot-toast'

export default function App() {
  return (
    <>
      <Toaster />
      <AppRouter />
    </>
  )
}
