import React, {Component} from 'react';
import VideoPlayer from './VideojsPlayer';
import {Button, Collapse} from 'reactstrap';
import {loggedInUser} from "../../interfaces/loginSignupUser";
import {Prop, State, buyProductObject, fullCourseData, courseContent} from "../../interfaces/CourseInDetailComponent";
import Header from "../Header/header";
import AddToCart from "../AddToCart/AddToCart";
import Footer from "../Footer/footer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRupeeSign} from "@fortawesome/free-solid-svg-icons";

import './CourseInDetail.css';

class CourseInDetail extends Component<Prop, State> {
    private cartFlag: Number = 0
    constructor(props: Prop) {
        super(props);
        this.state = {
            collapse: false,
            id: 0,
            popoverOpen: false,
            modal: false,
            Registermodal: false,
            signUpModel: false
        };

        this.addToCart = this.addToCart.bind(this);
        this.chkIncart = this.chkIncart.bind(this);
        this.goToCart = this.goToCart.bind(this);
        this.buyProduct = this.buyProduct.bind(this);
        this.LoginPopup = this.LoginPopup.bind(this);
        this.registrPopup = this.registrPopup.bind(this);
    }

    registrPopup() {
        this.setState(prevState => ({
            Registermodal: !prevState.Registermodal
        }));
    }

    LoginPopup() {
        this.setState(prevState => ({
            signUpModel: !prevState.signUpModel
        }));
    }

    goToCart(e: React.FormEvent<HTMLInputElement>) {
        e.preventDefault();
        this.props.routeProps.history.push({pathname: '/cart/'})
    }

    buyProduct(courseData: buyProductObject[]) {
        debugger
        let loggedInUser: loggedInUser  = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
        const isUserLoggedIn = loggedInUser !== null ? loggedInUser.token != null : false;
        if (!isUserLoggedIn) {
            debugger
            this.setState({
                signUpModel: true
            });
        } else {
            if (this.state.signUpModel) {
                this.setState({signUpModel: false});
            }
            this.props.routeProps.history.push({pathname: '/cart/checkout/', state: courseData});
        }
    }

    addToCart() {
        this.setState(prevState => ({
            modal: !prevState.modal,
            popoverOpen: false
        }));
    }

    onLink = () => {
        this.addToCart();
    };

    onAuthenticateLink = () => {
        this.registrPopup();
        this.LoginPopup();
    };

    toggle = (index: number) => {
        this.setState(state => ({id: index, collapse: !state.collapse}));
    };

    closeLoginModel = () => {
        if (this.state.signUpModel) {
            this.setState({
                signUpModel: false
            });
        }
    }

    chkIncart = (courseData: fullCourseData) => {
        const that = this;
        if (localStorage.getItem('addToCart') !== null) {
            let cartDataStorage = JSON.parse(localStorage.getItem('addToCart') || '{}');
            cartDataStorage.map(function (cartData: buyProductObject, index: number) {
                if (cartData.course_Name === courseData.course_Name) {
                    that.cartFlag = 1;
                }
                return true;
            })
        }
    };

    render() {
        console.log(this.state.signUpModel);
        debugger
        const that = this;
        let courseData: fullCourseData | any
        courseData = this.props.routeProps.location.state;
        let divideforLoop = courseData.learn.length / 2;
        let divideinLoop = Math.round(divideforLoop);
        this.chkIncart(courseData);
        let learnDataArranged = [];
        let courseContentStore: any[] = [];
        let requirementStore: any[] = [];
        let learnCount = 0;

        let price = parseInt(courseData.price);
        let offer = parseInt(courseData.offer);
        let discount = parseInt(String(price - ((price * offer) / 100)));

        for (let i = 0; i < divideinLoop; i++) {
            learnDataArranged.push(
                <div className="row" key={i}>
                        <div className="col-md-5">
                            <li className="list-data">
                                {courseData.learn[learnCount]}
                            </li>
                        </div>
                    {courseData.learn[learnCount + 1] !== null ?
                            <div className="col-md-5">
                                <li className="list-data">
                                    {courseData.learn[learnCount + 1]}
                                </li>
                            </div>
                        : null
                    }
                </div>
            );
            learnCount += 2
        }

        courseData.course_content.map(function (courseContent: courseContent, index: number) {
            courseContentStore.push(<div key={index} className="coursecontent-wrap p-2" onClick={() => that.toggle(index)}>
                    {courseContent.content_Name}</div>,
                <Collapse key={"collaps"+index} isOpen={index === that.state.id ? that.state.collapse : false}>
                    {courseContent.sub_Content.map(function (contentData: string, index: number) {
                        return (<div key={index} className="course-title p-2">{contentData}</div>)
                    })
                    }
                </Collapse>
            )
            return true;
        });

        courseData.requirement.map(function (requirement: string, index: number) {
            requirementStore.push(<li key={index}>{requirement}</li>)
            return true;
        });

        let isAdminLoggedIn = false;
        let loggedInUser: loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
        if (loggedInUser) {
            isAdminLoggedIn = loggedInUser.role === '1'? true : false;
        }
        const videoJsOptions = {
            poster: courseData.course_Img,
            autoplay: false,
            controls: true,
            sources: [{
                src: courseData.course_video,
                type: 'video/mp4'
            }]
        };
        debugger
        return (
            <div>
                <Header routeProps = {this.props.routeProps} signUpForBuyNow = {this.state.signUpModel} manageBuyNowState = {this.closeLoginModel}/>
                <div className="HeaderComponent add-header-cls">
                    <div className="carousel-fullscreen-sidebar">
                        <div className="streamer__content">
                            <h3>{courseData.course_Name}</h3>
                            <p>{courseData.course_Subtitle}</p>
                            <p className="m-0">{"Created by " + courseData.created_By.join()}</p>
                            <p className="m-0">{"Language : " + courseData.language}</p>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="learnbox-wrap container">
                                <div className="learnBox">
                                    <h5>What you'll learn</h5>
                                    {learnDataArranged}
                                </div>

                                <div className="course-info">
                                    <div>
                                        <h5>Course Content</h5>
                                        {courseContentStore}
                                    </div>
                                </div>
                                <div className="course-requirement"><h4>Requirements</h4>
                                    <ul>
                                        {requirementStore}
                                    </ul>
                                </div>
                                <div className="course-description">
                                    <h4>Description</h4>
                                    <div>{courseData.description}</div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 player-margin">
                            <VideoPlayer {...videoJsOptions} />
                            <div>Total:</div>
                            <div><h3><FontAwesomeIcon icon={faRupeeSign} />{discount}</h3></div>
                            {discount === price ? null
                                :
                                <p style={{ textDecorationLine: 'line-through' }}>
                                    <FontAwesomeIcon icon={faRupeeSign} />{price}
                                </p>
                            }
                            {
                                !isAdminLoggedIn && (
                                    this.cartFlag === 1
                                        ? <Button className="render-btn" outline color="secondary" onClick={(e) => this.goToCart(e)}>Go to cart</Button>
                                        : <Button className="render-btn" outline color="danger" onClick={this.addToCart}>Add to
                                            cart</Button>
                                )
                            }
                            <br/>
                            {
                                !isAdminLoggedIn && (
                                    <div className="buy-now-btn">
                                        <Button className="render-btn" outline color="secondary" onClick={() => this.buyProduct([{
                                            "course_Name": courseData.course_Name,
                                            "course_Img": courseData.course_Img,
                                            "created_By": courseData.created_By.join(),
                                            "price": price,
                                            "discount": discount,
                                            "category_Name": courseData.category_Name
                                        }])}>Buy now</Button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
                <AddToCart isOpen={this.state.modal} toggle={this.addToCart} className={this.props.className}
                           routeProps = {this.props.routeProps}
                           onlinkclick={this.onLink.bind(this)} data={this.state.modal ? {
                            "course_Name": courseData.course_Name,
                            "course_Img": courseData.course_Img,
                            "created_By": courseData.created_By.join(),
                            "price": price,
                            "discount": discount,
                            "category_Name": courseData.category_Name
                    } : null} />
                <Footer/>
            </div>
        );
    }
}

export default CourseInDetail;
