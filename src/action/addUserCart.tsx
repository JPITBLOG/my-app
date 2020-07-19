import {Action} from "redux";
import {ThunkAction} from "redux-thunk";
import {AppState} from "../store";
import {buyProductObject} from "../interfaces/CourseInDetailComponent";

import {addUserCartDataService} from '../services/loginSignUpUser';
import {
    USER_CART_ADDED_SUCCESSFULLY,
    THERE_IS_AN_ERROR_TO_ADD_CART
} from '../reducer/loginUser';


interface addUserCartProps {
    cartData: buyProductObject[] | [],
    u_id: string | undefined
}

export const addUserCartData = (passDataObject: addUserCartProps | {}): ThunkAction<void, AppState, {}, Action> => {
    return dispatch => {
        debugger
        return addUserCartDataService(passDataObject)
            .then((response) => {
                if(response.status === 200) {
                    let loggedInUser  = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
                    loggedInUser = {...loggedInUser, cartData: response.data};
                    debugger
                    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
                    dispatch({
                        type:USER_CART_ADDED_SUCCESSFULLY,
                        data:response.data
                    })
                    return true;
                }
            })
            .catch((error) => {
                if(error.response){
                    dispatch({
                        type:THERE_IS_AN_ERROR_TO_ADD_CART,
                        data:{message: error.response.data.error_msg}
                    });
                    return false;
                }
            });
    }
};

export const addUserCartDataForFaceBook = (passDataObjects: addUserCartProps): ThunkAction<void, AppState, {}, Action> => {
    let loggedInUser  = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    loggedInUser = {...loggedInUser, cartData: passDataObjects.cartData};
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    return dispatch => {
        dispatch({
            type:USER_CART_ADDED_SUCCESSFULLY,
            data:passDataObjects.cartData
        })
        return true;
    }
};