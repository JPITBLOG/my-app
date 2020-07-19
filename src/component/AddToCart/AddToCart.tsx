import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ThunkDispatch} from "redux-thunk";
import {Action} from "redux";
import {AppState} from "../../store";
import {addCartItem} from "../../action/cartInfo";
import {addUserCartData, addUserCartDataForFaceBook} from "../../action/addUserCart";
import {Prop, State, AddToCartDataObj} from '../../interfaces/AddToCartComponent'
import {loggedInUser} from '../../interfaces/loginSignupUser'
import './AddToCart.css'

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRupeeSign} from "@fortawesome/free-solid-svg-icons";

import {Alert, Button,
    Modal, ModalBody,
    ModalFooter, ModalHeader} from "reactstrap";
import {getAllCourse} from "../../action/courses";
import {categories} from "../../interfaces/category";
class AddToCart extends Component<Prop, State>{
    constructor(props: Prop){
        super(props);
        this.state = {
            storageflag : 1,
            allCourse: []
        }
        this.addTouserCart = this.addTouserCart.bind(this);
    }

    chkData = (objectData: AddToCartDataObj[]) => {
        const that = this;
        let getCartData = [];

        getCartData = JSON.parse(String(localStorage.getItem("addToCart")));
        getCartData.map(function (card: any,index: number){
            if(objectData.length >1){
                if(card.course_Name === objectData[1].course_Name){
                    that.setState({storageflag:0});
                }
            }
            else{
                that.setState({storageflag:0});
            }
            return 0;
        });
        return getCartData;
    }

    addToCartData = async (Objectdata: AddToCartDataObj[]) => {
        const that = this;
        let getCartData;
        if(Objectdata.length > 1){
            getCartData = this.chkData(Objectdata);
            if(that.state.storageflag === 1){
                getCartData.push(Objectdata[1]);
                localStorage.setItem("addToCart",JSON.stringify(getCartData));
                console.log('login user : ', this.props.loginUser);
                debugger
                await this.props.addCartItem(getCartData);
                let loggedInUser: loggedInUser  = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
                if(loggedInUser !== null){
                    await this.addTouserCart(getCartData);
                }
                that.setState({storageflag:0});
            }
        }
    }
    GoToCartData = () => {
        this.props.onlinkclick();
        this.props.routeProps.history.push({pathname:'/cart/'});
    }

    addTouserCart = async (cartData: any[]) => {
        let loggedInUser: loggedInUser  = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
        let u_id = loggedInUser._id;
        let postDtaObject = {u_id,cartData};
        if ('loginWithFacebook' in this.props.loginUser) {
            this.props.addUserCartDataForFaceBook(postDtaObject)
        }
        else await (this.props.addUserCartData(postDtaObject));
        //await this.props.addUserCartData(postDtaObject);
    }

    async componentDidMount() {
        await getAllCourse((err: object, response: categories[]) => {
            if (response) {
                this.setState({allCourse: response});
            }
        });
    }

    async componentDidUpdate(prevProps: Readonly<Prop>, prevState: Readonly<State>, snapshot?: any) {
        if (JSON.stringify(prevState.allCourse) !== JSON.stringify(this.state.allCourse)) {
            await getAllCourse((err: object, response: categories[]) => {
                if (response) {
                    this.setState({allCourse: response});
                }
            });
        }
    }

    render(){
        let that = this;
        let totalPrice = 0;
        let totaldiscountedPrice = 0;
        if(this.props.data !== null){
            let storageflag = 1;
            let cartStorage = [];
            let obj:AddToCartDataObj[] = [];
            let dataBindTocart: any[] = [];

            obj.push(this.props.data);

            if(localStorage.getItem("addToCart") !== null){
                cartStorage = JSON.parse(String(localStorage.getItem("addToCart")));
                cartStorage.map(function (card: any,index: number){
                    if(card.course_Name === that.props.data!.course_Name){
                        storageflag = 0;
                    }
                    return 0;
                })
            }
            if(storageflag === 1 || localStorage.getItem("addToCart") === null){
                cartStorage.push(this.props.data);
                localStorage.setItem("addToCart",JSON.stringify(cartStorage));
                let saveForLater = JSON.parse(String(localStorage.getItem("saveForCart")));
                if (saveForLater !== null && saveForLater.length > 0) {
                    let removeDataIndex = saveForLater.findIndex((singleObject: AddToCartDataObj) => singleObject.course_Name === this.props.data?.course_Name);
                    saveForLater.splice(removeDataIndex, 1);
                    localStorage.setItem("saveForCart", JSON.stringify(saveForLater));
                }
                console.log('user data: ', this.props.loginUser);
                debugger
                this.props.addCartItem(cartStorage);
                let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
                if(loggedInUser !== null){
                    this.addTouserCart(cartStorage);
                }
            }

            this.state.allCourse.map(function (course,index){
                if(course.category_Name === obj[0].category_Name && course.course_Name !== obj[0].course_Name && obj.length === 1){
                    let price = parseInt(course.price);
                    let offer = parseInt(course.offer);
                    let discount = parseInt(String(price - ((price * offer) / 100)));
                    obj.push({"course_Name":course.course_Name,"course_Img":course.course_Img,"created_By":course.created_By.join(),
                        "price":price,"discount":discount,"category_Name":course.category_Name});
                }
                return 0;
            });
            console.log('object data got here: ',obj);
            debugger
            obj.map(function (value,index) {
                let coursefullName = value.course_Name;
                const courseName = () => {
                    if (coursefullName.length < 41)
                        return coursefullName;
                    else
                        return coursefullName.substring(0, 33) + "..";
                };

                totalPrice += value.price;
                totaldiscountedPrice += value.discount;
                debugger
                dataBindTocart.push(
                    <div className="card" id="card" style={that.props.cardStyle} key={value.course_Name}>
                        <div id="card">
                            <div className="card-wrap">
                                <img alt="#" src={value.course_Img} id="img" width="230" height="125"/>
                                <p className="title">{courseName()}</p>
                                <p className="desc">{value.created_By}</p>
                                {value.discount === value.price ? null
                                    :
                                    <p className="desc">{"Price: "}
                                    <text style={{ textDecorationLine: 'line-through' }}>
                                        <FontAwesomeIcon icon={faRupeeSign} />{value.price}
                                    </text>
                                    </p>
                                }
                                <p className="desc">
                                    <text>{"discounted Price: "}</text>
                                    <text>
                                        <FontAwesomeIcon icon={faRupeeSign} />{value.discount}
                                    </text>
                                </p>
                                <p className="desc">{value.category_Name}</p>
                            </div>
                        </div>
                    </div>
                );
                return 0;
            });

            if(this.state.storageflag === 1){
                this.chkData(obj);
            }
            return(
                <Modal isOpen={that.props.isOpen} toggle={that.props.toggle} className={that.props.className}>
                    <ModalHeader toggle={that.props.toggle}><Alert color="success">
                        Added{" "+obj[0].course_Name}
                        &nbsp;&nbsp;<Button onClick={that.GoToCartData.bind(that)}>Go to Cart</Button></Alert></ModalHeader>
                    <ModalBody>
                        <div className="d-flex flex-row">
                            {dataBindTocart}
                        </div><br/>
                        <div className="row">
                                <text>{"Total Price: "}</text>
                            <FontAwesomeIcon icon={faRupeeSign} /><text>{totaldiscountedPrice}</text>
                            <div><text style={{ textDecorationLine: 'line-through' }}>
                                <FontAwesomeIcon icon={faRupeeSign} />{totalPrice}</text>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {this.state.storageflag === 1 ?
                            <Button color="info" onClick={that.addToCartData.bind(that,obj)}>Add to Cart</Button>
                            :
                            <Button color="white" onClick={that.GoToCartData.bind(that,obj)}>Go to Cart</Button>}
                    </ModalFooter>
                </Modal>
            );
        }
        else {
            return null;
        }
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, any, Action>)  => {
   return {
        addCartItem: bindActionCreators(addCartItem, dispatch),
        addUserCartData: bindActionCreators(addUserCartData,dispatch),
        addUserCartDataForFaceBook: bindActionCreators(addUserCartDataForFaceBook, dispatch)
   }
};

const mapStateToProps = (state: AppState) => {
    const {loginUser} = state;
    return {
        loginUser: loginUser
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(AddToCart);
