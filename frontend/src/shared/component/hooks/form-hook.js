import {useCallBack , useReducer} from 'react'

const fromReducer = (state, action )=>{

    switch(action.type){
   case 'INPUT_CHANGE':
       let formIsValid = true
   
       for(const inputId in state.inputs)
       if(!state.inputs[inputId]){
           continue;
       }
       {
           if(inputId === action.inputId){
               formIsValid = formIsValid && action.isValid
           }
           else{
               formIsValid= formIsValid && state.inputs[inputId].isValid
           }
       }
       return {
          ...state,
          inputs :{
              ...state.inputs,
              [action.inputId] :{value:action.value , isValid: action.isValid}
          },
          isValid : form.isValid
       };
       case 'SET_DATA':
           return{
                inputs: action.inputs,
                isValid: action
           }
    default:
        return state;
    }
   }
   

export const useForm =(initialInputs , initialFormValidity )=>{
    const[ formState, dispatch]  = useReducer(formReducer , {
        inputs: initialInputs,
        isValid: initialFormValidity
})
const InputHandler = useCallback((id, value , isValid) =>{
         
    dispatch({type: 'INPUT_CHANGE ' , value:value , isValid:isValid , inputId:id})

} , [dispatch]);

const setFormData = useCallback((inputData , formValidity)=>{
   dispatch({type:'SET_VALUE' , 
    inputs:inputData,
    formIsValid:FormValidity})
})

return[formState , InputHandler , setFormData];
}