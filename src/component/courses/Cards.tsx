import React,{Component} from 'react';
import {RouteComponentProps} from "react-router-dom";
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import {connect} from 'react-redux';

import './Display.css';
import bner from '../../Assets/slider.png';
import {categories} from '../../interfaces/category';
import AddToCart from "../AddToCart/AddToCart";
import {AppState} from "../../store";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRupeeSign} from "@fortawesome/free-solid-svg-icons";

interface Prop {
    getboxWidth?: number,
    cardStyle: {
        transform: string
    },
    cardData: any,
    courses: any,
    categorydetail: categories[],
    routeProps: RouteComponentProps,
    className?: string,
    loginUser?: any
}

interface State {
    popoverOpen: boolean,
    modal: boolean,
    id: string
}

class Cards extends Component<Prop, State> {
    private cardData: any = []
    constructor(props: Prop){
        super(props);
        this.state = {
            popoverOpen: false,
            modal:false,
            id: ''
        };
        this.addToCart = this.addToCart.bind(this);
    }

    onCourseClick = (cart: any) => {
        if (this.props.routeProps) {
            this.props.routeProps.history.push({pathname:'/course-detail/',state:cart,search:"?id="+cart._id})
        }
    }

    onHover = (e: string) => {
        this.setState({
            id:e,
            popoverOpen: true
        });
    }

    onHoverOut = () => {
        this.setState({
            popoverOpen: false
        });
    }

    addToCart(){
        this.setState(prevState => ({
            modal: !prevState.modal,
            popoverOpen: false
        }));
    }

    onLink = () => {
        this.addToCart();
    }

    render() {
        // let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
        // let newCardObject;
        // let lngth = this.props.cardData.length;
        // let selectedData = {};
        let cartflag = 0;
        this.cardData = this.props.cardData;

        try {
            return (
                <div>
                    <section className= "d-flex flex-row" onMouseLeave={() => this.onHoverOut()}>
                        {
                            this.cardData.map((card: any, i: number) => {
                                cartflag = 0;
                                let coursefullName = card.course_Name;
                                const courseName = () => {
                                    if (coursefullName.length < 41)
                                        return coursefullName;
                                    else
                                        return coursefullName.substring(0, 41) + "..";
                                };
                                let price = parseInt(card.price);
                                let offer = parseInt(card.offer);
                                let discount = parseInt(String(price - ((price * offer) / 100)));

                                let learnPoint = card.learn.map(function (learnPointData: any, index: number) {
                                    if (index < 4)
                                        return (<li className="list-data" key={"li"+index}>
                                                    {learnPointData}
                                                </li>);
                                    return true;
                                });
                                if(this.props.loginUser !== null && this.props.loginUser.role === 0){
                                    if(this.props.loginUser.cartData !== undefined && this.props.loginUser.cartData.length > 0){
                                        this.props.loginUser.cartData.map(function (cartData: any,index: number) {
                                            if(cartData.course_Name === card.course_Name){
                                                cartflag = 1;
                                            }
                                            return true;
                                        });
                                    }
                                }
                                if(localStorage.getItem('addToCart') !== null){
                                    let cartDataStorage = JSON.parse(localStorage.getItem('addToCart') || '{}');
                                    cartDataStorage.map(function (cartData: any,index: number){
                                        if(cartData.course_Name === card.course_Name){
                                            cartflag = 1;
                                        }
                                        return true;
                                    })
                                }
                                // @ts-ignore
                                // @ts-ignore
                                return (
                                    <div>
                                        <div className="card" id="course-card" style={this.props.cardStyle} key={"div"+i}
                                             onMouseOver={() => this.onHover('Popover-' + i)} onClick={this.onCourseClick.bind(this,card)}>
                                            <div id={'Popover-' + i} key={i+"Card"}>
                                                <div className="card-wrap" key={i+"CardUnder"}>
                                                    <img alt={'course'} height={'110px'} src={card.course_Img} key={"img"+i}/>
                                                    <p key={"p"+i} className="title">{courseName()}</p>
                                                    <p key={"p2"+i} className="desc">{card.created_By.join()}</p>
                                                    {discount === price ? null
                                                        :
                                                        <p key={"p3"+i} className="desc">
                                                            <text>{"Price: "}</text>
                                                            <FontAwesomeIcon icon={faRupeeSign}/>
                                                            <text style={{ textDecorationLine: 'line-through' }}>{price}</text>
                                                        </p>
                                                    }
                                                    <p key={"p4"+i} className="desc">{"discounted Price: "}<FontAwesomeIcon icon={faRupeeSign}/>{discount}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {('Popover-' + i) === this.state.id ?
                                            (<><Popover class="card-popover" placement="left" key={i+"Popover"}
                                                        isOpen={this.state.popoverOpen} target={'Popover-' + i}>
                                                    <PopoverHeader className="fix-header" key={i+"header"}>
                                                        {card.course_Name}</PopoverHeader>
                                                    <PopoverBody className="fix-body" key={i+"Body"}><p>{"in" + card.category_Name}</p><p>{card.course_Subtitle}</p>
                                                        <p>
                                                            <ul>
                                                                {learnPoint}
                                                            </ul>
                                                        </p>
                                                        { cartflag === 1 ?
                                                            <a href="http://localhost:3001/cart/">
                                                                <Button key={i+"goto"} id="btn-position" outline color="secondary">Go to cart</Button></a>
                                                            : <Button key={i+"addToCart"} id="btn-position" className="btn-primary" color="danger" onClick={this.addToCart}>Add to cart</Button>
                                                        }

                                                    </PopoverBody>
                                                </Popover>
                                                    <AddToCart key={"AddToCart"+i} routeProps = {this.props.routeProps}  isOpen={this.state.modal}  toggle={this.addToCart} className={this.props.className}
                                                               onlinkclick = {this.onLink.bind(this)} data = {this.state.modal ? {"course_Name":card.course_Name,"course_Img":card.course_Img,"created_By":card.created_By.join(),
                                                        "price":price,"discount":discount,"category_Name":card.category_Name}: null} cardStyle = {this.props.cardStyle} />
                                                </>
                                            )
                                            : null
                                        }
                                    </div>
                                )
                            })
                        }
                    </section>
                </div>

            )
        }catch (e) {
            return (
                <div>there is no any data in this category.</div>
            );
        }
    }
}

const mapStateToProps = (state: AppState) => {
    const {loginUser} = state;
    return {
        loginUser : loginUser
    }
};

export default connect(mapStateToProps, null)(Cards);
