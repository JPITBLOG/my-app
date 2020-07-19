import {loggedInUserActionData} from '../interfaces/loginSignupUser';

interface LoginInterface {
    loginDetail: object,
    errormsg: object
}

type actionType = loggedInUserActionData
const INITIAL_STATE: LoginInterface = {
    loginDetail: {},
    errormsg: {}
}

export const REQUESTED_LOGIN_USER = 'REQUESTED_LOGIN_USER';
export const REQUESTED_LOGOUT_USER = 'REQUESTED_LOGOUT_USER';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const USER_CART_ADDED_SUCCESSFULLY = 'USER_CART_ADDED_SUCCESSFULLY';
export const THERE_IS_AN_ERROR_TO_ADD_CART = 'THERE_IS_AN_ERROR_TO_ADD_CART';
export const REQUESTED_REGISTER_USER = 'REQUESTED_REGISTER_USER';
export const REGISTER_FAIL = 'REGISTER_FAIL';

export default (state = INITIAL_STATE,action : actionType) => {
    switch (action.type) {
        case REQUESTED_LOGIN_USER: {
            return state.loginDetail =  action.data
        }
        case REQUESTED_LOGOUT_USER: {
            return state.loginDetail = action.data
        }
        case LOGIN_FAIL: {
            return state.errormsg = action.data
        }
        case REQUESTED_REGISTER_USER: {
            return state.loginDetail = action.data
        }
        case REGISTER_FAIL: {
            return state.errormsg = action.data
        }
        case USER_CART_ADDED_SUCCESSFULLY: {
            let loginUserDetail = {...state, cartData: action.data};
            return state.loginDetail = {...loginUserDetail,}
        }
        case THERE_IS_AN_ERROR_TO_ADD_CART: {
            return state.errormsg = action.data
        }
        default:
            return state;
    }
}