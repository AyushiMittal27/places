import React , {useEffect , useState} from 'react'
import PlaceList from '../component/PlaceList'
import {useParams} from 'react-router-dom'
import {useHttpClient} from '../../shared/component/hooks/http-hook'
import ErrorModal from '../../shared/component/UIElement/ErrorModal'
import LoadingSpinner from '../../shared/component/UIElement/LoadingSpinner'

const UserPlaces = ()=>{
const [loadedPlaces , setLoadedPlace] = useState()
const {isLoading , error , sendRequest , clearError} = useHttpClient()
const userId= useParams().userId;

useEffect(()=>{

    const fetchPlaces=async ()=>{
            try{
                const responseData = await sendRequest(`http://localhost:500/api/places/users/${userId}`)
                setLoadedPlace(responseData);
            }catch(err){

            }
    }


} ,[sendRequest , userId])

const placeDeleteHandler=(deltedPlaceID)=>{
    setLoadedPlace(prevPlaces=> prevPlaces.filter(place => place.id!== deltedPlaceID))
}

const loadedPlaces = places.filter(p => p.creator === userId)
return (
 <React.Fragment>   
 <ErrorModal  error={error} onClear={clearError}/>
 {isLoading && <div className="center"><LoadingSpinner/> </div>}    
{!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace ={placeDeleteHandler} />}
</React.Fragment>);

}

export default UserPlaces;