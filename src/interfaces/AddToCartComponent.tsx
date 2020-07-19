import {RouteComponentProps} from "react-router-dom";
import {loggedInUser} from "./loginSignupUser";
import {buyProductObject} from "./CourseInDetailComponent";

interface addUserCartProps {
    cartData: buyProductObject[] | [],
    u_id: string | undefined
}

export interface AddToCartDataObj {
    course_Name: string,
    course_Img: string,
    created_By: string,
    price: number,
    discount: number,
    category_Name: string
}

export interface Prop {
    routeProps: RouteComponentProps,
    isOpen: boolean,
    toggle: () => void,
    onlinkclick: () => void,
    className: string | undefined,
    data: AddToCartDataObj | null,
    addCartItem: (data: any[]) => void,
    addUserCartData: (data: {}) => void,
    addUserCartDataForFaceBook: (data: addUserCartProps) => void,
    cardStyle?: {
        transform: string
    },
    loginUser: loggedInUser
}

export interface State {
    storageflag: number,
    allCourse: any[]
}