import React , {useEffect , useState , useContext} from 'react';
import {useParams, useHistory} from 'react-router-dom'
import Input from '../../shared/FormElements/Input'
import Button from '../../shared/FormElements/Button'
import {VALIDATOR_REQUIRE} from '../../shared/util/validator'
import { useForm } from '../../shared/component/hooks/form-hook';
import {useHttpClient} from '../../shared/component/hooks/http-hook'
import Card from '../../shared/component/UIElement/Card'
import LoadingSpinner from '../../shared/component/UIElement/LoadingSpinner'
import ErrorModal from '../../shared/component/UIElement/ErrorModal'
import {AuthContext} from '../../shared/component/context/auth-context'

const UpdatePlace = ()=>{
const auth= useContext(AuthContext)
const {isLoading , error ,sendRequest, clearError} = useHttpClient()    
const [loadedPlace , setLoadedPlace] = useState()
const placeid = useParams().placeid
const history =useHistory()
const[isLoading , setisLoading] = useState(true)
const [formState , inputHandler , setFormData] =  useForm({
    title:{
        value :'',
        isValid: false
    },
    description:{
      value :'',
      isValid: false
  }
  
} , false)


useEffect(()=>{
 const fetchPlace= async()=>{
     try{
        const responseData = await sendRequest(`http://localhost:5000/api/places/${placeid}`)
        setLoadedPlace(responseData.place);
        setFormData({
            title:{
                value :responseData.place.title,
                isValid: true
            },
            description:{
              value :responseData.place.description,
              isValid: true
          }
          
        } , true)
        history.push('/' + auth.userId + '/places') 
     }catch(err){

     }  
 }
  fetchPlace();
},[sendRequest, placeid , setFormData])

const placeUpdateSubmitHandler =async (event)=>{
  event.preventDefault();
  try{
    await sendRequest(`http://localhost:5000/api/${placeid}`, 'PATCH' , JSON.stringify({
      title:formState.inputs.title.value,
      description:formState.inputs.description.value,
    }),{
        'Content-Type' : 'application/json',
        Authorization : 'Bearer '+ auth.token
    })
  }catch(err){

  }  

}

  

if(isLoading)
{
    return (
        <div className="center">
         <LoadingSpinner />
        </div>

    )
} 

  if(!loadedPlace  && !error) {
      return (
      <div className="center">
          <Card>
          <h2>Could not find place!</h2>2
          </Card>
      </div>)
  }
   

   return (
    <React.Fragment>
     <ErrorModal error={error} onClear={clearError} />   
    {!isLoading && loadedPlace && <form className="place-form" onSubmit ={placeUpdateSubmitHandler}>
   
   <Input 
   id="title"
   element= "input"
   type="text"
   label="Title"
   validators={[VALIDATOR_REQUIRE() ]}
   errorText="Please enter a valid Text"  
   onInput={inputHandler}
   initialValue={loadedPlace.title}
   initialValid={true}
   />
   
   <Input 
   id="description"
   element= "textarea"
   label="Description"
   validators={[VALIDATOR_MINLENGTH(5) ]}
   errorText="Please enter a valid description (min 5 characters)"
   onInput={inputHandler}
   initialValue={loadedPlace.description}
   initialValid={true}
   />
   <Button type="submit" disabled ={!formState.isValid} >UPDATE</Button>
   </form>}
   </React.Fragment>
   )
}


export default UpdatePlace;