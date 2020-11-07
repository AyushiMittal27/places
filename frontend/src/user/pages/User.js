import React , {useState, useEffect} from 'react'
import UsersList from '../component/UsersList'
import ErrorModel from '../../shared/component/UIElement/ErrorModal'
import LoadingSpinner from '../../shared/component/UIElement/LoadingSpinner'
import {useHttpClient} from '../../shared/component/hooks/form-hook'

const User=()=>{
    const {isLoading , error , sendRequest , clearError} = useHttpClient()
   const [loadedUsers , setLoadedUsers] = useState()

   useEffect =(()=>{
    const fetchUsers=async ()=> {
        
        try{
            const responseData= await sendRequest('http://localhost:5000/api/users/')
            setLoadedUsers(responseData)
        }catch(err){

        }
       } 
       fetchUsers();
   }, [sendRequest])

   const errorHandler = ()=>{
       setError(null);
   }

    return(
        <React.Fragment>
            <ErrorModel error ={err} onClear={errorHandler} />
            {isLoading && <div className="center"><LoadingSpinner /></div>}
        {!isLoading && loadedUsers && <UsersList  items={loadedUsers}/>}
        </React.Fragment>
    )
}

export default User;