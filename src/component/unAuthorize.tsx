import React,{Component} from "react";
import {RouteComponentProps} from "react-router";

import Header from "./Header/header";
import Footer from "./Footer/footer";

import "./courses/courses.css";

interface Prop {
    routeProps: RouteComponentProps
}

interface State {

}
class UnAuthorize extends Component<Prop, State> {
    render() {
        return (
            <div>
                <Header routeProps={this.props.routeProps}/>
                <div className="page-container">
                    <h1>Un authorize</h1>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default UnAuthorize;