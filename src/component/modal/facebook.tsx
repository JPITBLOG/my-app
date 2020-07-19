import React,{Component} from 'react';
import {connect} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {bindActionCreators, Action} from "redux";
import FacebookLogin from "react-facebook-login";
import {AppState} from "../../store";

import {userLoginWithFacebookRequest} from "../../action/loginUser";
import {loggedInUser} from "../../interfaces/loginSignupUser";

interface dispatchProps {
    userLoginWithFacebook: (userObj: loggedInUser) => void;
}

interface simpleProp {
    loginToggle: () => void;
}

type Prop = dispatchProps & simpleProp

interface State {
    isLoggedIn: boolean,
    userID: string,
    name: string,
    email: string,
    picture: ''
}

interface facebookResp {
    accessToken: string,
    data_access_expiration_time: number,
    expiresIn: number,
    graphDomain: string,
    id: string,
    name: string,
    picture: any,
    signedRequest: string,
    userID: string
}

interface loginDetail {
    email: string,
    name: string,
    password: string,
    role: string,
    token: string,
    _id: string
}

class Facebook extends Component<Prop, State> {
    constructor(props: Prop){
        super(props);
        this.state = {
            isLoggedIn:false,
            userID:'',
            name:'',
            email:'',
            picture:""
        }
    }

    componentClicked = () => {

    }

    responseFacebook = async (response: facebookResp) => {
        console.log('resp data: ', response);
        let userObj = {
            loginWithFacebook: true,
            email: '',
            name: response.name,
            password: '',
            role: '0',
            token: response.accessToken,
            _id: response.id
        }
        await this.props.userLoginWithFacebook(userObj);
        await this.props.loginToggle;
    }

    render() {
        let fbContent;
        if(this.state.isLoggedIn) {
            fbContent = null;
        }

        return (<div><FacebookLogin
            appId="661499064446169"
            autoLoad={false}
            fields="name,email,picture"
            onClick={this.componentClicked}
            callback={this.responseFacebook}
        /></div>);
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, any, Action>) => {
    return {
        userLoginWithFacebook: bindActionCreators(userLoginWithFacebookRequest, dispatch)
    }
}

export default connect(null, mapDispatchToProps)(Facebook);
