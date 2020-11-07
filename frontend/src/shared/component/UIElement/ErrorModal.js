import React from 'react';
import Modal from './Modal';
import Button from '../../FormElements/Button';



const ErrorModel = props =>{
    return(
        <Modal
        onCancel={props.onClear}
        header="An Error Occured"
        show={!!props.error}
        footer={<Button onClick={props.onClear}>Okay</Button>}
        >
            <p>{props.error}</p>
        </Modal>
    )
}

export default ErrorModel
