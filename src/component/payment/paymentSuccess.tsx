import React, {Component} from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {connect} from 'react-redux';
import './paymentSuccess.css';
import {AppState} from "../../store";
import {ThunkDispatch} from "redux-thunk";
import {Action, bindActionCreators} from "redux";
import {addCartItem} from "../../action/cartInfo";
import {addUserCartData, addUserCartDataForFaceBook} from "../../action/addUserCart";
import {loggedInUser} from "../../interfaces/loginSignupUser";
import {buyProductObject} from "../../interfaces/CourseInDetailComponent";
import {AddToCartDataObj} from "../../interfaces/AddToCartComponent";
import Header from '../Header/header';
import Footer from "../Footer/footer";

interface addUserCartProps {
    cartData: buyProductObject[] | [],
    u_id: string | undefined
}

interface Prop {
    routeProps: RouteComponentProps,
    addCartItem: (data: buyProductObject[]) => void,
    addUserCartData: (data: addUserCartProps) => void,
    addUserCartDataForFaceBook: (data: addUserCartProps) => void;
    loginUser: loggedInUser,
    cartInfo: {
        cartItem: AddToCartDataObj[]
    }
}

interface State {

}

class PaymentSuccess extends Component<Prop, State>{
    private addInCart: any[] = [];

    removeCartFromAccount = async() => {
        let u_id = this.props.loginUser._id;
        let cartData: [] = [];
        let postDataObject = {u_id,cartData}
        await (localStorage.removeItem('addToCart'),localStorage.removeItem('saveForCart'));
        if (this.props.loginUser.cartData!.length > 0) {
            if ('loginWithFacebook' in this.props.loginUser) {
                this.props.addUserCartDataForFaceBook(postDataObject)
            }
            else await (this.props.addUserCartData(postDataObject));
        }
        if (this.props.cartInfo.cartItem.length > 0) {
            await (this.props.addCartItem(cartData));
        }
    }

    getCartData = () => {
        const that = this;
        this.addInCart = [];
        const cartData = JSON.parse(String(localStorage.getItem('finalCartData')));
        cartData.map(function (course: buyProductObject,index: number) {
            that.addInCart.push(
                <li className="list-data" key={"li"+index}>{course.course_Name}</li>
            )
            return true;
        });
        return this.addInCart;
    }

    render() {
        if(this.props.loginUser !== null &&
            this.props.loginUser.cartData !== undefined &&
            this.props.loginUser.cartData.length > 0){
            this.removeCartFromAccount();
        }
        return (
            <div>
                <Header routeProps={this.props.routeProps}/>
                <div className="page-container success-alert">
                    <div className="success-box-container">
                        <div className="header-text">
                    <h5 style={{fontWeight: "bold"}}>{'Thank you!'}</h5>
                    <h6>{'Your payment is successful with: '}</h6>
                        </div>
                    <div>
                        <ul>
                            {this.getCartData()}
                        </ul>
                    </div>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

const mapStateToProps = (state: AppState) => {
    const {loginUser,cartInfo} = state;
    return {
        loginUser: loginUser,
        cartInfo: cartInfo
    }
};

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, undefined, Action>)  => {
    return {
        addCartItem: bindActionCreators(addCartItem, dispatch),
        addUserCartData: bindActionCreators(addUserCartData, dispatch),
        addUserCartDataForFaceBook: bindActionCreators(addUserCartDataForFaceBook, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentSuccess);
