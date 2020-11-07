import React , {useReducer, USeFFECT, useEffect} from 'react'
import './Input.css'
import {validate} from '../util/validator'

const inputReducer = (state , action)=>{
switch(action.type){
    case 'CHANGE':
        return {
            ...state,
            value : action.value,
            isValid: validate(action.val , action.validators)
        };
    case 'TOUCH':
        return {
            ...state,
            isTouched: true
        }
     default:
         return state;   
}

};

const Input =(props)=>{

const [inputState , dispatch]=useReducer(inputReducer ,
     {value:props.InitialValue ||''  ,isTouched:false, isValid: props.InitialValid || false });

const {id , onInput} =props;
const{value , isValid} = inputState;

useEffect(()=>{

   onInput(props.id, inputState.value , inputState.isValid)
},[id, value , onInput , isValid]
)

const changeHandler= event =>{
    dispatch({type:'CHANGE' , val:event.target.value , validators: props.validators})
}    

const touchHandler = ()=>{
    dispatch({type:'TOUCH'})
}

const element = props.element ==='input' ? (
<input 
id={props.id}
type={props.type} 
placeholder={props.placeholder} 
onChange={changeHandler}
onBlur={touchHandler}
value = {input.state.value}/>
    ) :( 
    <textarea id={props.id} rows={props.rows ||3} onChange={changeHandler}  value = {input.state.value} onBlur={touchHandler}/>) 

    return(
      <div className= {`${form-control} ${!inputState.isValid && inputState.isTouched && 'form-control__invalid'}`}>
          <label htmlFor={props.id} >{props.label} </label>
          {element}
    {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p> }
      </div>
    )
}


export default Input;