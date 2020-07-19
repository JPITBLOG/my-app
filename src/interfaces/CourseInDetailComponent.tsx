import {RouteComponentProps} from "react-router-dom";

export interface Prop {
    routeProps: RouteComponentProps,
    className: string
}

export interface State {
    collapse: boolean,
    id: Number,
    popoverOpen: boolean,
    modal: boolean,
    Registermodal: boolean,
    signUpModel: boolean
}

export interface buyProductObject {
    "course_Name": string,
    "course_Img": string,
    "created_By": string,
    "price": number,
    "discount": number,
    "category_Name": string
}

export interface courseContent {
    content_Name: string
    sub_Content: string[]
}

export interface fullCourseData {
    category_Id: string
    category_Name: string,
    course_Img: string,
    course_video: string,
    course_Name: string,
    course_Subtitle: string,
    course_content: courseContent[],
    created_By: string[],
    description: string,
    language: string,
    learn: string[],
    offer: number,
    price: number,
    requirement: string[],
    _id: string
}

export interface addCourseDataType {
    category_Id: string
    category_Name: string,
    course_Img?: string,
    course_video?: string,
    course_Name: string | null,
    course_Subtitle: string | null,
    course_content: courseContent[],
    created_By: string[],
    description: string | null,
    language: string,
    learn: string[] | string | null,
    offer: string | null,
    price: string | null,
    requirement: string[],
    _id?: string
}