import React,{Component} from 'react';
import {RouteComponentProps} from "react-router-dom";
import {Media,Button} from "reactstrap";
import {buyProductObject} from "../../interfaces/CourseInDetailComponent";

import axios from 'axios/index';
import Header from "../Header/header";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRupeeSign} from "@fortawesome/free-solid-svg-icons";

import './CheckOut.css';
import Footer from "../Footer/footer";

interface Props {
    routeProps: RouteComponentProps
}

interface State {

}

class Checkoutpag extends Component<Props, State> {
    private cartDataMap: any[] = [];
    private totalPrice: number = 0;
    private totalOriginalPrice: number = 0;
    constructor(props: Props) {
        super(props);
        this.getAllCheckoutData = this.getAllCheckoutData.bind(this);
    }

    courseName = (course_Name: string) => {
        if (course_Name.length < 24)
            return course_Name;
        else
            return course_Name.substring(0, 24) + "..";
    };

    sendPayment = (event: React.FormEvent<HTMLInputElement>,payment: number) => {
        debugger
        const data = {
            amount: payment
        };
        axios.post( 'http://192.168.16.1:3004/payment/bid', data )
            .then( res => {
                window.location.href = res.data;

            })
            .catch((error) => console.log(error.response.data));
    }

    getAllCheckoutData = () => {
        this.totalPrice = 0;
        this.totalOriginalPrice = 0;
        this.cartDataMap = [];
        const that = this;
        let CardData: Array<buyProductObject> | any   = this.props.routeProps.location.state;
        localStorage.setItem('finalCartData',JSON.stringify(CardData));
        try {
            if (CardData !== null) {
                CardData!.map(function (Cart: buyProductObject, index: number) {
                    that.cartDataMap.push(
                        <Media className="checkout-wrap" key={index}>
                            <Media left>
                                <Media object src={Cart.course_Img} height="35px" width="35px"/>
                            </Media>
                            <Media body>
                                <Media heading>
                                    <div className='checkout-wrap course-wrap' style={{paddingTop: "15px"}}>
                                        <div className='d-flex' style={{paddingLeft: "5px"}}>
                                            <p>{that.courseName(Cart.course_Name)}</p>
                                            {/*<p className="instructorName">{Cart.created_By}</p>*/}
                                            <div className='d-flex' style={{paddingLeft: "50px"}}>
                                                <p><FontAwesomeIcon icon={faRupeeSign}/>{Cart.discount}</p>
                                                <p style={{ textDecorationLine: 'line-through' }}><FontAwesomeIcon icon={faRupeeSign}/>{Cart.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Media>
                                <div>
                                </div>
                            </Media>
                        </Media>
                    )
                    that.totalOriginalPrice += Cart.price;
                    that.totalPrice += Cart.discount;
                    return true;
                })
            }
        }
        catch (e) {
            that.cartDataMap.push(<div>There is no any data available</div>);
        }
    }

    render(){
        this.getAllCheckoutData();
        return(
            <div>
                <Header routeProps={this.props.routeProps}/>
                <div className="main-checkout-wrap page-container">
                    <div><h4 style={{fontWeight: "bold"}}>Order Details</h4></div>
                    <div className="row">
                        <div className="col-xs-3">
                            {this.cartDataMap}
                        </div>
                        <div className="col-xs-3 box-content">
                            <div className="row">
                                <div className="col-xs-6">
                                    <h6>
                                        <text>{`Original total price: `} <FontAwesomeIcon icon={faRupeeSign} />{this.totalOriginalPrice}</text>
                                    </h6>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-6">
                                    <h6>
                                        <text>{"Total amount: "}</text>
                                        <text>
                                            <FontAwesomeIcon icon={faRupeeSign} />{this.totalPrice}
                                        </text>
                                    </h6>
                                </div>
                            </div>
                            <div className="row">
                                <Button className="w-100" color="danger" size="sm" onClick={(event) => this.sendPayment(event,this.totalPrice)}>Pay now</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default Checkoutpag;