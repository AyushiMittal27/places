import React from 'react'
import ReactDOM from 'react-dom'
import {CSStransition }from 'react-transition-group'
import './SideDrawer.css'

const SideDrawer= (props)=>{
      const content= 
      <CSStransition 
      in={props.show} 
      timeout={200}
     className={"slide-in-left"}
     mountonEnter
     unmountonExit >    
      <aside className="side-drawer" onClick={props.onClick}>{props.children}</aside>
      </CSStransition>
      return ReactDOM.createPortal(content , document.getElementById('drawer-hook'))
}

export default SideDrawer