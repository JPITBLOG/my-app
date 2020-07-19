import {ThunkAction} from 'redux-thunk';
import {Action} from "redux";
import {AppState} from "../store";
import {AddToCartDataObj} from "../interfaces/AddToCartComponent";
import {CART_ITEM_ADDED_SUCCESSFULLY,ERROR_WHILE_ADD_CART_ITEM,CART_ITEM_REMOVE_SUCCESSFULLY,
    ERROR_WHILE_REMOVE_CART_ITEM} from '../reducer/cartInfo';

export const addCartItem = (cartItem: AddToCartDataObj[]): ThunkAction<void, AppState, {}, Action> =>{
    return dispatch => {
        try {
            dispatch({
                type:CART_ITEM_ADDED_SUCCESSFULLY,
                data:cartItem
            })
        }
        catch (e) {
            dispatch({
                type:ERROR_WHILE_ADD_CART_ITEM,
                data:{error_message:e.toString()}
            })
        }
    }
};

export const removeCartItem = (): ThunkAction<void, AppState, {}, Action> =>{
    let cartStorage: [] = [];
    return dispatch => {
        try {
            dispatch({
                type:CART_ITEM_REMOVE_SUCCESSFULLY,
                data:cartStorage
            })
        }
        catch (e) {
            dispatch({
                type:ERROR_WHILE_REMOVE_CART_ITEM,
                data:{error_message:e.toString()}
            })
        }
    }
};