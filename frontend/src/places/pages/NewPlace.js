import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {VALIDATOR_REQUIRE , VALIDATOR_MINLENGTH} from '../../shared/util/validator'
import Input from '../../shared/FormElements/Input'
import Button from '../../shared/FormElements/Button'
import {useForm} from '../../shared/component/hooks/form-hook'
import {useHttpClient} from '../../shared/component/hooks/http-hook'
import {authContext} from '../../shared/component/context/auth-context'
import ErrorModel from '../../shared/component/UIElement/ErrorModal'
import LoadingSpinner from '../../shared/component/UIElement/LoadingSpinner'
import ImageUpload from '../../shared/FormElements/ImageUpload'
import './NewPlace.css'

const NewPlace = () =>{
    const auth = useContext(AuthContext);
    const {isLoading , error , sendRequest, clearError} =useHttpClient();
    const[formState , inputHandler]=useForm(
        {
            title : {
               value : '',
               isValid: false
           },
           description:{
               value: '',
               isValid:false
           },
           address:{
               value:'',
               isValid:false
           },
           image:{
               value: null,
               isValid: false
           }
        }
    )

    const history = useHistory(); 

    const placeSubmitHandler = async (event)=>{

    event.preventDefault();
    try{
        const formData = new FormData();
        formData.append('title' ,formState.inputs.title.value)
        formData.append('description' ,formState.inputs.description.value)
        formData.append('address' ,formState.inputs.address.value)
        formData.append('image' ,formState.inputs.image.value)
        await sendRequest('http://localhost:5000/api/places' , 'POST' ,formData, {
            Authorization :'Bearer '+ auth.token
        })
        // Redirect the user 
        history.push('/')
    }catch(err){

    }
}


     return (
     <React.Fragment>
     <ErrorModel error={error} onClear={clearError} />
     <form className="place-form" onSubmit={placeSubmitHandler} >
     {isLoading && <LoadingSpinner asOverLay/>}
     <Input
      id="title"
      element='input'
      type="text"
      label="Title" 
      validators={[VALIDATOR_REQUIRE()]} 
      errorText='Please enter a valid title'
      onInput = {InputHandler} />

      <Input
      id="description"
      element='textarea'
      label="Description" 
      validators={[VALIDATOR_MINLENGTH(5)]} 
      errorText='Please enter a valid description(at least 5 chararcter)'
      onInput = {InputHandler} />

      <Input
      id="address"
      element='textarea'
      label="Description" 
      validators={[VALIDATOR_REQUIRE()]} 
      errorText='Please enter a valid address'
      onInput = {InputHandler} />

      <ImageUpload id="image" onInput={inputHandler} errorText='Please provide an image' />
      <Button type="submit" disabled={!formState.isValid} >ADD PLACE</Button>
      </form>
      </React.Fragment>
)

}


export default NewPlace