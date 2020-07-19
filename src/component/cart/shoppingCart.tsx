import React, {Component} from 'react';
import {RouteComponentProps} from "react-router-dom";
import {Media, Button} from 'reactstrap';
import {Action, bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ThunkDispatch} from "redux-thunk";
import {AppState} from "../../store";
import {addCartItem} from "../../action/cartInfo";
import {addUserCartData, addUserCartDataForFaceBook} from "../../action/addUserCart";
import {loggedInUser} from "../../interfaces/loginSignupUser";
import {buyProductObject} from "../../interfaces/CourseInDetailComponent";
import {AddToCartDataObj} from "../../interfaces/AddToCartComponent";
import Header from "../Header/header";
import Footer from "../Footer/footer";
import './shoppingCart.css';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRupeeSign} from "@fortawesome/free-solid-svg-icons";

interface addUserCartProps {
    cartData: buyProductObject[] | [],
    u_id: string | undefined
}

interface Prop {
    routeProps: RouteComponentProps
    addCartItem: (data: buyProductObject[]) => void
    addUserCartData: (data: addUserCartProps) => void,
    addUserCartDataForFaceBook: (data: addUserCartProps) => void;
    loginUser: loggedInUser,
    cartInfo: {
        cartItem: AddToCartDataObj[]
    }
}

interface State {
    removeItm: string | null,
    saveItem: string | null,
    moveItem: string | null,
    modal: boolean,
    signUpModal: boolean
}

class ShoppingCart extends Component<Prop, State> {
    constructor(props: Prop){
        super(props);
        this.state = {
            removeItm:null,
            saveItem:null,
            moveItem:null,
            modal: false,
            signUpModal: false
        }
    }

    deleteCourse = async (courseName: string,CartLink: string) => {
        let filtred;
        let deleteCart;
        if(CartLink === "addToCart"){
            deleteCart = JSON.parse(String(localStorage.getItem('addToCart')));
            filtred = deleteCart.filter(function(cart: buyProductObject,index: number){
                return cart.course_Name !== courseName;
            });
            localStorage.setItem("addToCart",JSON.stringify(filtred));
            if(this.props.loginUser !== null){
                let u_id = this.props.loginUser._id;
                let cartData = filtred;
                let passObjectData = {u_id,cartData}
                if ('loginWithFacebook' in this.props.loginUser) {
                    this.props.addUserCartDataForFaceBook(passObjectData)
                }
                else await (this.props.addUserCartData(passObjectData));
                // await(this.props.addUserCartData(passObjectData));
                let userDetail = this.props.loginUser;
                localStorage.setItem("LoginUser",JSON.stringify(userDetail));
            }
            this.props.addCartItem(filtred)

        }
        else{
            deleteCart = JSON.parse(String(localStorage.getItem('saveForCart')));
            filtred = deleteCart.filter(function(cart: buyProductObject,index: number){
                return cart.course_Name !== courseName;
            });
            localStorage.setItem("saveForCart",JSON.stringify(filtred));
        }
    }

    removeCourse = (courseName: string, CartLink: string) => {
        this.deleteCourse(courseName,CartLink);
        this.setState({removeItm:courseName});
    }

    saveLaterCourse = (saveDataObject: buyProductObject,CartLink: string) => {
        let saveCartData = [];
        this.deleteCourse(saveDataObject.course_Name,CartLink);
        if(localStorage.getItem('saveForCart') !== null){
            saveCartData = JSON.parse(String(localStorage.getItem('saveForCart')));
        }
        saveCartData.push(saveDataObject);
        localStorage.setItem('saveForCart',JSON.stringify(saveCartData));
        this.setState({saveItem:saveDataObject.course_Name});
    }

    moveToCart = async(moveDataObject: buyProductObject) => {
        let getCartData = [];
        let filtred;

        let deleteCart = JSON.parse(String(localStorage.getItem('saveForCart')));
        filtred = deleteCart.filter(function(cart: buyProductObject,index: number){
            return cart.course_Name !== moveDataObject.course_Name;
        });
        localStorage.setItem("saveForCart",JSON.stringify(filtred));

        if(localStorage.getItem('addToCart') !== null) {
            getCartData = JSON.parse(String(localStorage.getItem('addToCart')));
        }
        getCartData.push(moveDataObject);
        localStorage.setItem('addToCart',JSON.stringify(getCartData));
        this.props.addCartItem(getCartData)
        if(this.props.loginUser !== null) {
            let u_id = this.props.loginUser._id;
            let cartData = getCartData;
            let passObjectData = {u_id, cartData}
            if ('loginWithFacebook' in this.props.loginUser) {
                this.props.addUserCartDataForFaceBook(passObjectData)
            }
            else await (this.props.addUserCartData(passObjectData));
            //await (this.props.addUserCartData(passObjectData));
        }
        this.setState({moveItem:moveDataObject.course_Name});
    }

    mapped = (index: number,cartData: buyProductObject, CartLink: string) => {
        const that = this;
        return(<Media className="main-wrap" key={index}>
            <Media left>
                <Media object src={cartData.course_Img} height="100px" width="100px"/>
            </Media>
            <Media body>
                <Media heading>
                    <div className='course-wrap'>
                        <div className='d-flex flex-column w-75'>
                            <p>{cartData.course_Name}</p>
                            <p className="instructorName">{cartData.created_By}</p>
                        </div>
                        <div className='d-flex flex-column remove-text'>
                            <p><a onClick={that.removeCourse.bind(this,cartData.course_Name,CartLink)}>{"Remove"}</a></p>
                            {CartLink === 'addToCart' ?
                                <p><a onClick={that.saveLaterCourse.bind(this, cartData,CartLink)}>Save for Later</a></p>
                                : <p><a onClick={that.moveToCart.bind(this, cartData)}>Move to Cart</a></p>
                            }
                        </div>
                        <div className='price-list'>
                            <p><FontAwesomeIcon icon={faRupeeSign} />{cartData.discount}</p>
                            <p style={{ textDecorationLine: 'line-through' }}><FontAwesomeIcon icon={faRupeeSign} />{cartData.price}</p>
                        </div>
                    </div>
                </Media>
                <div>
                </div>
            </Media>
        </Media>);
    }

    controlSIgnupToggle = () => {
        this.setState(prevState => ({
            signUpModal: !prevState.signUpModal
        }));
    }

    Checkout = (cartData: buyProductObject[] | null) => {
        const isUserLoggedIn = this.props.loginUser !== null ? this.props.loginUser.token != null : false;
        debugger
        if(!isUserLoggedIn) {
            debugger
            this.controlSIgnupToggle();
        }
        else {
            debugger
            this.props.routeProps.history.push({pathname:'/cart/checkout/',state:cartData});
        }
    }

    render() {
        const that = this;
        let cartDataMap: any[] = [];
        let saveCartMap: any[] = [];
        let saveCart = null;
        let cartData = null;
        let totalPrice = 0;
        let totalDiscount = 0;

        if(this.props.cartInfo.cartItem !== null){

            let cartDataStorage = this.props.cartInfo.cartItem;
            cartData = cartDataStorage.slice(0);
            cartData.map(function (cartData, index) {
                totalPrice += cartData.price;
                totalDiscount += cartData.discount;
                cartDataMap.push(
                    that.mapped(index,cartData,'addToCart')
                );
                return 0;
            });
        }

        if (localStorage.getItem('saveForCart') !== null) {
            let cartDataStorage = JSON.parse(String(localStorage.getItem('saveForCart')));
            saveCart = cartDataStorage.slice(0);
            saveCart.map(function (cartData: buyProductObject, index: number) {
                saveCartMap.push(
                    that.mapped(index,cartData,'saveForCart')
                );
                return 0;
            });
        }

        return (
            <div>
                <Header routeProps={this.props.routeProps} signInbeforeCheckout = {this.state.signUpModal ? true : false} controlSIgnupToggle = {this.controlSIgnupToggle}/>
                <div className="cart-style">
                <div className="header-Content">
                    <section className="style--jumbotron-header-bar--cart--3GsX0 jumbotron jumbotron-header-bar">
                        <div className="container">
                            <div className="jumbotron-header-bar__inner">
                                <div>
                                    <ol role="navigation" aria-label="breadcrumbs" className="breadcrumb">
                                        <li className=""><a href="/"><span className="udi udi-home">Home</span></a></li>
                                        <li className="active"><span>/&nbsp;Shopping Cart</span></li>
                                    </ol>
                                    <h1 data-purpose="shopping-cart-title">Shopping Cart</h1>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <div className="container">
                    <div className="row cart-wrap">
                        <div className="col-md-8"><div><h5>{cartDataMap.length > 0 ? cartDataMap.length+" Course in Cart" : null}</h5></div>
                            <div>
                                {cartDataMap.length > 0 ? cartDataMap :
                                    <div><h2>There is no any course you selected</h2></div>}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div>Total:</div>
                            <div><h3><FontAwesomeIcon icon={faRupeeSign} />{totalDiscount}</h3></div>
                            <p style={{ textDecorationLine: 'line-through' }}><FontAwesomeIcon icon={faRupeeSign} />{totalPrice}</p>
                            {cartDataMap.length > 0 ?
                                <Button className="checkoutbtn btn-primary" onClick={this.Checkout.bind(this,cartData)}>Checkout</Button>
                                :
                                null
                            }

                        </div>
                    </div>
                    <div>Save for Later</div>
                    <div className="row cart-wrap">
                        {saveCartMap.length > 0 ? <> <div className="col-md-8">{saveCartMap}</div>
                        </> : null }
                    </div>
                </div>
                </div>
                <Footer/>
            </div>
        );
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

export default connect(mapStateToProps,mapDispatchToProps)(ShoppingCart);
