import React,{Component} from 'react';
import {connect} from "react-redux";
import {Route,Redirect} from 'react-router-dom';

class CustomRoute extends Component{

    getExtractedJson({component, cprivate, role, loginUser, ...rest}) {
        return rest;
    }

    render() {
        const rest = this.getExtractedJson(this.props);
        const {component, cprivate, role, loginUser} = this.props;
        const Component = component;

        let redirectTo = undefined;

        if (!('token' in loginUser) && cprivate) {
            redirectTo = '/';
        }

        else if (('token' in loginUser) &&
                cprivate &&
                role &&
                role.filter((chkRole) => chkRole == loginUser.role).length === 0) {
                redirectTo = '/unauthorize';
        }

        return(
            <Route {...rest} render = {routeProps => (
                (redirectTo)? <Redirect routeProps = {routeProps} to={{pathname:redirectTo, state:{from:routeProps.location}}}/>
                    : <Component routeProps = {routeProps} />
            )}
            />
        );
    }
}

const mapStateToProps = (state) => {
    const {loginUser} = state;
    return {
        loginUser: loginUser
    }
}

export default connect(mapStateToProps)(CustomRoute);
