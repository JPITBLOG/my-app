import {categories} from "./category";

interface dispatchProp {
    addfilteredTopic: (topic: string, value: string) => void;
    removefilteredTopic: (topic: string, value: string) => void;
}

interface generalProps {
    topic: any
}

export type Prop = generalProps & dispatchProp

export interface State {
    collapse: Boolean,
    matchedArray: string[],
    allCategories: categories[],
    allCourse: any[],
    defaultCheckedTopic: boolean,
    topic: string,
    checkedValue: any
}