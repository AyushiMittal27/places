import React, {useState, Fragment} from 'react'
import {Link , NavLinks} from 'react-router-dom'
import './MainNavigation.css'
import MainHeader from './MainHeader'
import NavLinks from './NavLinks'
import SideDrawer from './SideDrawer'
import Backdrop from './Backdrop'



const MainNavigation = (props)=>{
const[drawerIsOpen , setDrawerIsOpen] =useState(false);

const openDrawerHandler= ()=>{
    setDrawerIsOpen(true)
}


const closeDrawerHandler= ()=>{
    setDrawerIsOpen(false)
}

    return (
        <>
        {drawerIsOpen && <Backdrop onClick={closeDrawerhandler} />}
        <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
            <nav className="main-navigation__drawer-nav">
                <NavLinks />
            </nav>
        </SideDrawer>
    <MainHeader>
        <button className="main-navigation_menu-btn" onClick={openDrawerHandler}> 
        <span />
        <span />
        <span />
        <span />    
        </button>
        <h1 className="main-navigation title">
            <Link to='/'>Your Places</Link>
        </h1>
        <nav className="main-navigation_header_nav">
        <NavLinks />
        </nav>
    </MainHeader>
    </>)
}


export default MainNavigation;

