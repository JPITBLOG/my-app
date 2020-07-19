import {ThunkAction} from 'redux-thunk';
import {Action} from "redux";
import {AppState} from "../store";
import {REQUESTED_LOGIN_USER, REQUESTED_LOGOUT_USER,
    LOGIN_FAIL, REQUESTED_REGISTER_USER, REGISTER_FAIL} from '../reducer/loginUser';
import {loginUser, registerUser, registerAdmin} from '../services/loginSignUpUser';
import {loginSignUpUser, loggedInUser} from '../interfaces/loginSignupUser';

export const signUpUserRequest = (signUpUserObject: loginSignUpUser): ThunkAction<void, AppState, {}, Action> => {
    return dispatch => {
        registerUser(signUpUserObject)
            .then((response) => {
                if(response.status === 200){
                    localStorage.setItem("loggedInUser",JSON.stringify(response.data));
                    dispatch({
                        type:REQUESTED_REGISTER_USER,
                        data: response.data
                    });
                }
            }).catch((error) => {
                dispatch({
                    type:REGISTER_FAIL,
                    data: {message: error.response? error.response.data.message : "there is an error while calling API"}
                });
        })
    }
}

export const loginUserRequest = (loginUserObject: loginSignUpUser): ThunkAction<void, AppState, {}, Action> => {
    return dispatch => {
        loginUser(loginUserObject)
            .then((response) => {
                if (response.status === 200) {
                    localStorage.setItem('loggedInUser', JSON.stringify(response.data));
                    dispatch({
                        type: REQUESTED_LOGIN_USER,
                        data: response.data
                    });
                }
        }).catch((error) => {
            dispatch({
                type: LOGIN_FAIL,
                data: {message: error.response.data.message}
            });
        });
    };
}

export const userLoginWithFacebookRequest = (loginUserObject: loggedInUser): ThunkAction<void, AppState, {}, Action> => {
    return dispatch => {
        localStorage.setItem('loggedInUser', JSON.stringify(loginUserObject));
        dispatch({
            type: REQUESTED_LOGIN_USER,
            data: loginUserObject
        });
    };
}

export const logOutUserRequest = (): ThunkAction<void, AppState, {}, Action> => {
    return dispatch => {
        localStorage.removeItem("loggedInUser");
        dispatch({
            type: REQUESTED_LOGOUT_USER,
            data: {message: 'logged out'}
        });
    }
};

export const signUpAdminRequest = (instructorObj: any): ThunkAction<void, AppState, {}, Action> => {
    return dispatch => {
        registerAdmin(instructorObj)
            .then((response) => {
                if (response.status === 200) {
                    localStorage.setItem("loggedInUser",JSON.stringify(response.data));
                    dispatch({
                        type: REQUESTED_REGISTER_USER,
                        data: response.data
                    });
                    return true;
                }
            }).catch((error) => {
            if (error.response) {
                dispatch({
                    type: REGISTER_FAIL,
                    data: {message: error.response ? error.response.data.message : 'there is an error while calling API'}
                })
                return false;
            }
        });
    }
}

