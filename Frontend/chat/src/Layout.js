import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'


export default function Layout({ userx, setuserx }) {
  return (
    <>
    <Header userx={userx} setuserx={setuserx}/>
    <Outlet/>
    <Footer/>
    </>
  )
}
