import {RouteComponentProps} from "react-router-dom";

export interface Prop {
    selectedTopic: {
        AllSelectedTopic: string[],
    },
    routeProps: RouteComponentProps
}

export interface State {
    sortedBy: string,
    topic: string[],
    allCourse: any[]
}