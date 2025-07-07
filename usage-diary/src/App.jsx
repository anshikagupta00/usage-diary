import { useState } from 'react'
import './App.css'
import ServiceForm from './components/ServiceForm'
import ServiceList from './components/ServiceList'
import Tracker from './components/Tracker'
import { Route, Routes } from 'react-router-dom';


function App() {
  

  return (
    <div >

      <h1 className="text-3xl font-bold flex  justify-center">
        Usage Diary
      </h1>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="max-w-2xl mx-auto mt-8 p-4 shadow rounded">
                <h2 className="text-xl font-semibold mb-4 text-[#d65a31]">Add New Service</h2>
                <ServiceForm />
              </div>
              <ServiceList />
            </>
          }
        />

        <Route
          path="/tracker/:serviceId"
          element={<Tracker/>}
        />
      </Routes>
    </div>
  )
}

export default App