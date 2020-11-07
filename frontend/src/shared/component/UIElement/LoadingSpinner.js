import react from 'React'
import './LoadingSpinner.css'

const LoadingSpinner = props =>{
    return (
        <div className ={`${props.asOverlay && 'loading-spinner__ovrlay'}`}>
            <div className="lds-dual-ring"></div>
        </div>
    )
}


export default LoadingSpinner;