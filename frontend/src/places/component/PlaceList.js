import React from 'react'
import Card from '../../shared/component/UIElement/Card'
import './PlaceList.css'


const PlaceList=(props)=>{
   if(props.items.length === 0)
   {
       return <div className="place-list center">
           <Card>
               <h2>No places found , Maybe create one ?</h2>
               <Button to='/places/new'>Share a place</Button>
           </Card>
       </div>
   }
   

   return<ul className="place-list">
       {props.item.map(place=><PlaceItem 
       key={place.id}
       id={place.id}
       image={place.image}
       title={place.title}
       description={place.description}
       address={place.address}
       createdId={place.creator}
       coordinates={place.location}
       onDelete ={props.onDeletePlace}
       />
           )}
   </ul>
}

export default PlaceList