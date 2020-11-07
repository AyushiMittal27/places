import React , {useState, useContext} from 'react'
import Input from '../../shared/FormElements/Input'
import Button from '../../shared/FormElements/Input'
import './Auth.css'
import {VALIDATOR_EMAIL , VALIDATOR_MINLENGTH , VALIDATOR_REQUIRE} from '../../shared/util/validator'
import {useForm} from '../../shared/component/hooks/form-hook'
import {AuthContext} from '../../shared/component/hooks/form-hook'
import ErrorModel from '../../shared/component/UIElement/ErrorModal'
import LoadingSpinner from '../../shared/component/UIElement/LoadingSpin'
import {useHttpClient} from '../../shared/component/hooks/http-hook'
import ImageUpload from '../../shared/FormElements/ImageUpload'

const Auth =()=>{
  const auth = useContext(AuthContext)  
  const[isLoginMode , setisLoginMode]= useState(true);
  const {isLoading , inputHandler , sendRequest, clearError} =useHttpClient();


  const [formState , inputHandler] = useForm(
        {
            email:{
                value :'',
                isValid: ''
            },
            password:{
                value: '',
                isValid:''
            }
        }
    )

const switchModeHandler =()=>{
    if(!isLoginMode){
        setFormData({
            ...formState.inputs,
            name : undefined,
            image: undefined
        },formState.inputs.email.isValid && formState.inputs.password.isvalid)
    }
    else{
        setFormData({
            ...formState.inputs,
            name :{
                value : '',
                isValid: false
            },
            image:{
                value: null,
                isValid: false
            }
        }, false)    
    }
    setisLoginMode(prevMode => !prevMode);
}    

const authSubmitHandler = async event=>{

   event.preventDefault();
   if(isLoginMode){
        try{
                const responseaData =await sendRequest(
                'http://localhost:5000/api/users/login',
                'POST',
                 JSON.stringify({
                    email: formState.inputs.email.value,
                    password: formState.inputs.password.value
                }),
                {
                        'Content-Type': 'application/json'
                }
         )
         auth.login(responseData.userId , responseData.token);
        }catch(err){
          

        }
   }else{
       try{
           const formData= new FormData();
           formData.append('email',formState.inputs.email.value )
           formData.append('name',formState.inputs.name.value)
           formData.append('password', formState.inputs.password.value)
           formData.append('image',formState.inputs.image.value)
           const responseData =await sendRequest('http://localhost:5000/api/users/signup',
            'POST',
            formData
           )
           auth.login(responseData.userId , responseData.token)
       }catch(err){
       }
    
   }
   setIsLoading(false)
}


return(
    <React.Fragment>
    <ErrorModel error={error} onClear={clearError}/>
    <Card className ="authentication">
        {isLoading && <LoadingSpinner asOverlay  />}
        <h2> Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
            {!isLoginMode && <Input
              id="name"
              element="input"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText='Please enter a name.'
              onInput={inputHandler}
            />}

            {!isLoginMode && <ImageUpload center id="image" onInput={inputHandler} errorText="Please provide an image" />}
        <Input
        id="email"
        element="input"
        type="email"
        label="E-mail"
        validators={[VALIDATOR_EMAIL()]}
        errorText='Please enter a valid email address'
        onInput={inputHandler}
        />
        
        <Input
        id="password"
        element="input"
        type="password"
        label="Password"
        validators={[VALIDATOR_MINLENGTH(6)]}
        errorText='Please enter a valid password. Atleast 6 Character long'
        onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>{isLoginMode ? 'LOGIN' : 'SIGNUP'}</Button>
        </form>
        <Button inverse onClick={switchModeHandler}>SWITCH TO {isLoginMode ? 'SIGNUP' :'LOGIN'}</Button>
     </Card>
     </React.Fragment>
)
}


export default Auth