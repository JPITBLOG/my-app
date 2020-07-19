import baseService from './baseServices';

import {loginSignUpUser} from '../interfaces/loginSignupUser';

export function loginUser(loginUserObj: loginSignUpUser) {
    let loginObj = {
        eml: loginUserObj.email,
        pswd: loginUserObj.password
    }
    return baseService.post(`/user/login`, loginObj);
}

export function registerUser(signUpUserObj: loginSignUpUser){
    let signUpObj = {
        fname: signUpUserObj.fullname,
        eml: signUpUserObj.email,
        pswd: signUpUserObj.password,
        role: signUpUserObj.role
    }
    return baseService.post('/user/register',signUpObj);
}

export function registerAdmin(instructorObj: any) {
    return baseService.post('/instructor/addinstructor',instructorObj);
}

export function addUserCartDataService(passDataObject: any) {
    return baseService.post('/user/addusercart',passDataObject);
}