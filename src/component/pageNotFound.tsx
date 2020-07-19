import React, {Component} from "react";
import {RouteComponentProps} from "react-router";
import Header from "./Header/header";
import Footer from "./Footer/footer";

import "./courses/courses.css";

interface Prop {
    routeProps: RouteComponentProps
}

interface State {

}

class PageNotFound extends Component<Prop, State>{
    render() {
        return (
            <div>
                <Header routeProps={this.props.routeProps}/>
                <div className="page-container">
                    <h1>Page Not Found</h1>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default PageNotFound;