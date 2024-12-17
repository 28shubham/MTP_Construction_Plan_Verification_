import { unstable_useViewTransitionState } from 'react-router-dom';
import {toast} from 'react-toastify';
export const handleSuccess =(msg) =>{
    toast.success(msg,{
        position: 'top-right'
    })
}
export const handleError =(msg) =>{
    toast.error(msg,{
        position: 'top-right'
    })
}
