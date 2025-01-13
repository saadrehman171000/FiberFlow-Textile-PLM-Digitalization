import "./alerts.scss"
import React from 'react'
import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/siderbar/Sidebar"

const Alerts = () => {
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
      </div>
    </div>
  )
}

export default Alerts