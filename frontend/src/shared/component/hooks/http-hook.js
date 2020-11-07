import {useState , useCall, useCallback, useRef , useEffect} from 'react'
import { act } from '@testing-library/react';

export const useHttpClient = ()=>{

    const [isLoading , setIsLoading]= useState(false);
    const[error , setError]= useState()
    const activeHttpRequests = useRef([]); 
    
    const sendRequest = useCallback( async (url , method='GET' , body=null, headers= {}) =>{
    setIsLoading(true)   
    const httpAbortCtrll = new AbortController();
    activeHttpRequests.current.push(httpAbortCtrll);

    try{
        const response= await fetch(url , {
            method ,
            body,
            headers,
            signal : httpAbortCtrll.signal
       })
   

   const responseData = await responseData.json();

   activeHttpRequests.current = activeHttpRequests.current.filter(
       reqCtrl => reqCtrl!= httpAbortCtrll
       )

   if(!response.ok){
       throw new Error(responseData.message);
    }
   setIsLoading(false) 
   return responseData
   }catch(err){
    setError(err.message)
    throw err;
    }
    
 } , [0])

   const clearError = ()=>{
       setError(null);
   }
   useEffect(()=> {
     return ()=>{
         activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort())
     }
   }, [])
      return {isLoading , error , sendRequest , clearError}
}


module.exports = useHttpClient