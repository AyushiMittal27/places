import React from 'react'

import Card from '../../shared/component/UIElement/Card'
import UserItem from './UserItem'
import './UsersList.css'


const UsersList = (props)=>{
	if(props.item.length < 0){
	  return (<div class="center">
      <Card>
	  <h2>No users found</h2>
    </Card>
	  </div>
      )    
	}
	
	return (<ul className="users-list"> 
        {props.item.map ((user)=>{
        return <UserItem  
        key={user.id}
        id={user.id}
        image={user.image}
        name={user.name} 
        placeCount={user.places.length}/>
	})}
    </ul>)
}

export default UsersList