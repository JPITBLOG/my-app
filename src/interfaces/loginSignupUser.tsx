export interface loginSignUpUser {
    fullname?: string,
    email: string,
    password: string,
    role?: string
}

export interface loggedInUser {
    loginWithFacebook?: boolean,
    email: string,
    name: string,
    password: string,
    role: string,
    token: string,
    _id: string,
    cartData?: any[] | [],
    message?: string
}

export interface loginSignupAdmin {
    courses: number
    email: string
    name: string
    own_Img: string
    password: string
    profession: string
    role: string
    selfDescription: string
    token: string
    __v: number
    _id: string
}

interface errorInUser {
    message: string
}

export interface loggedInUserActionData {
    type: string,
    data: loggedInUser | errorInUser
}