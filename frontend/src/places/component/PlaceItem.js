import React , {useContext, useState}from 'react'
import Card from '../../shared/component/UIElement/Card';
import Button from '../../shared/FormElements/Button'
import './PlaceItem.css'
import Modal from '../../shared/component/UIElement/Modal'
import Map from '../../shared/component/UIElement/Map'
import {AuthContext} from '../../shared/component/context/auth-context'
import {useHttpClient} from '../../shared/component/hooks/http-hook'
import LoadingSpinner from '../../shared/component/UIElement/LoadingSpinner'
import ErrorModel from '../../shared/component/UIElement/ErrorModal';

const PlaceItem=(props)=>{
const {isLoading , error , sendRequest , clearError} = useHttpClient()    
const auth = useContext(AuthContext);
const [showmap , setShowMap]= useState(false);
const[showConfirmModal, setShowConfirmModal] = useState(false);
const openMapHandler = ()=> setShowMap(true);
const closeMapHandler = ()=> setShowMap(false);

const showDeleteWarningHandler =()=>{
    setShowConfirmModal(true)
}

const CancelDeleteHandler = ()=>{
    setShowConfirmModal(false)
}

const confirmDeleteHandler = ()=>{
    setShowConfirmModal(false)
    try{

        await sendRequest(
            `http://localhost:5000/api/places/${props.id}` ,
             'DELETE',
             null,
             {
                 Authorization : 'Bearer '+ auth.token
             } )
        props.onDelete(props.id)

    }catch{

    }
    
}

props.places.map((place , i)=>{
    return (
        <React.Fragment>
            <ErrorModel error={error} onClear={clearError}  /> 
            <Modal 
            show={showMap}
            onCancel={closeMapHandler}
            header={props.address}
            contentClass="place-item_model-content"
            footerClass="place-item__modal-actions"
            footer={<Button onClick={closeMapHandler} >CLOSE</Button>}
             >
              <div className="map-container">
                  <Map center={props.coordinates} zoom={16}></Map>
              </div>
             </Modal>  
             <Modal 
             show={showConfirmModal}
             onCancel={CancelDeleteHandler}
             header="Are you sure ?" 
             footerClass="place-item__modal-action"
             footer={
              <React.Fragment>
                  { auth.isLoggedIn &&  <Button inverse onClick ={CancelDeleteHandler}>CANCEL</Button> }
                  {auth.isLoggedIn && <Button danger>DELETE</Button>}
              </React.Fragment>
             }>
                 <p> Do you really want to proceed and delete this place ? Please note that delete can't be done after.</p>
             </Modal>  
     <li className="place-item__content">
     <Card  className="place-item">
      {isLoading && <LoadingSpinner asOverLay/>}
          <div className="place-item__image">
              <img src={`http://localhost:5000/${props.image}`} alt={props.title} />
                  
                  </div>
            <div className="place_item__info">
               <h2>{props.title}</h2>
               <h3>{props.address}</h3>
               <p>{props.description}</p>
           </div>
           <div className="place-item__actions">
            <Button inverse onClick ={openMapHandler}>VIEW ON MAP</Button>
             {auth.userId === props.creatorId && <Button to={`/places/${props.id}`}>EDIT</Button>} 
             {auth.userId === props.creatorId && <Button danger onClick={showDeleteWarningHandler} >DELETE</Button>}
           </div>
           </Card>
     </li>
     </React.Fragment>
    )
})

}

export default PlaceItem