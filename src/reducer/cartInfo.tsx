import {AddToCartDataObj} from "../interfaces/AddToCartComponent";
interface error_messages {
    error_message: string
}

interface actionType {
    type: string,
    data: AddToCartDataObj[] | error_messages | []
}

interface cartInfoState {
    cartItem: AddToCartDataObj[] | [],
    error_msg: error_messages
}
const INITIAL_STATE : cartInfoState = {
    cartItem: [],
    error_msg: {
        error_message: ''
    }
};

export const CART_ITEM_ADDED_SUCCESSFULLY = "CART_ITEM_ADDED_SUCCESSFULLY";
export const ERROR_WHILE_ADD_CART_ITEM = "ERROR_WHILE_ADD_CART_ITEM";
export const CART_ITEM_REMOVE_SUCCESSFULLY = "CART_ITEM_REMOVE_SUCCESSFULLY";
export const ERROR_WHILE_REMOVE_CART_ITEM = "ERROR_WHILE_REMOVE_CART_ITEM";

export default (state = INITIAL_STATE,action: actionType) => {
    switch(action.type){
        case CART_ITEM_ADDED_SUCCESSFULLY:{
            return Object.assign({},state,{cartItem: action.data});
        }
        case ERROR_WHILE_ADD_CART_ITEM:{
            return Object.assign({},state,{error_msg:action.data});
        }
        case CART_ITEM_REMOVE_SUCCESSFULLY:{
            return Object.assign({},state,{cartItem:action.data});
        }
        case ERROR_WHILE_REMOVE_CART_ITEM:{
            return Object.assign({},state,{error_msg:action.data});
        }
        default:
            return state;
    }
}
