import React from 'react';
import ReactDOm from 'react-DOM'
import './Modal.css';
import {CSSTransition} from 'react-transition-group'
import Backdrop from './Navigation/Backdrop'

const ModalOverLay = props =>{
    const content =(
        <div className={`modal ${props.className}`} style={props.style}>
         <header className={`modal__header ${props.headerClass}`} >
             <h2>
                 {props.header}
             </h2>
         </header>
         <form onSubmit ={props.onSubmit ? props.onSubmit: event=> event.preventDefault() }>
             <div className={`model_content ${props.contentClass}`} >
                 {props.children}
             </div>
             <footer className={`modal__footer ${props.footerClass}`} >
                 {props.footer}
             </footer>
          </form>   
        </div>)
    return ReactDOM.createPortal( Modal, document.getElementById(''))
}


const Modal =props =>{
  return <React.Fragment>
      {props.show  && <Backdrop onClick={props.onCancel} />}
      <CSSTransition
      in={props.show}
      mountOnEnter
      unmountOnExit
      timeout={200}
      classNames="modal"
      />
      <ModalOverLay {...props} />
  </React.Fragment>
   
}


export default Modal; 