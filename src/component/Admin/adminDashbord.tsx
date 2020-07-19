import React, {Component} from "react";
import {RouteComponentProps} from "react-router-dom";
import Header from "../Header/header";
import AdminNaveBar from "./adminNaveBar";
import TabSlider from "./tabSlide";

interface Props {
    routeProps: RouteComponentProps
}

interface State {

}

class AdminDashbord extends Component<Props, State>{
    render() {
        return (
            <div>
                <Header routeProps={this.props.routeProps} />
                <AdminNaveBar routeProps={this.props.routeProps} />
                <TabSlider routeProps={this.props.routeProps}/>
            </div>
        );
    }
}

export default AdminDashbord;

