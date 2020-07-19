import {Location} from "history";
import {RouteComponentProps} from "react-router-dom";
import {categories} from "./category";

export interface Props {
    location: Location,
    routeProps: RouteComponentProps
}

export interface State {
    allCategories: categories[]
}