//public node module.
import React, {Component} from "react";
import {connect} from 'react-redux';
import {ThunkDispatch} from 'redux-thunk';
import {bindActionCreators, Action} from 'redux';
import { RouteComponentProps } from "react-router-dom";

//import antd design and reactStrap
import '@fortawesome/free-solid-svg-icons';
import 'antd/dist/antd.css';
import {
    Navbar,
    NavbarBrand,
    NavbarToggler,
    Collapse,
    Nav,
    NavItem,
    NavLink,
    Button,
    UncontrolledDropdown,
    Input,
    InputGroup,
    InputGroupAddon,
    Tooltip,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from "reactstrap";
import {Menu, Dropdown, Icon} from 'antd';
import {SearchOutlined} from '@ant-design/icons';

//css & assets
import './header.css';
import logo from '../../Assets/logo-coral.svg';
import cartImg from '../../Assets/images (1).png';

//component
import SignUp from '../modal/signup'
import LogIn from "../modal/login";
import AdminRegister from "../Admin/adminRegister";

//import validation variable
import {emailRegex, passwordRegex, fullNameRegex, sentenseRegex, specialCharacterRegex} from '../../validationRegex';
import {AppState} from '../../store';
import {loginUserRequest, logOutUserRequest, signUpUserRequest, signUpAdminRequest} from '../../action/loginUser';
import {getAllCategory} from '../../action/categories';

import {loginSignUpUser, loggedInUser} from '../../interfaces/loginSignupUser';
import {categories} from '../../interfaces/category';
import {addUserCartData, addUserCartDataForFaceBook} from "../../action/addUserCart";
import {buyProductObject, fullCourseData} from "../../interfaces/CourseInDetailComponent";
import {AddToCartDataObj} from "../../interfaces/AddToCartComponent";
import {getAllCourse} from "../../action/courses";

const {SubMenu} = Menu;

interface State {
    isOpen: boolean,
    adminRegisterModal: boolean,
    signUpModal: boolean,
    logInModal: boolean,
    tooltipOpen: boolean,
    tooltipOpenTech: boolean,
    signUpLogInData: {
        fullname: string,
        email: string,
        password: string
    },
    errorObject: {
        fullname: string,
        email: string,
        password: string
    },
    adminSignUpLoginData: {
        name: string,
        eml: string,
        profession: string,
        selfDesc: string,
        password: string,
        selectedFile: imageFileType | null
    },
    adminSignUpErrorObj: {
        name: string,
        eml: string,
        profession: string,
        selfDesc: string,
        password: string,
        selectedFile: string
    },
    loginUser: Object,
    categoryData: categories[],
    unAuthorize: string,
    existUserErr: string,
    searchValue: string,
    searchOption: string[],
    allCourse: fullCourseData[],
    isLoggedInCancle: boolean,
}

interface addUserCartProps {
    cartData: buyProductObject[] | [],
    u_id: string | undefined
}

interface signUpLogInDataKey {
    fullname: string;
    email: string;
    password: string;
}

interface adminSignUpLoginDataKey {
    name: string,
    eml: string,
    profession: string,
    selfDesc: string,
    password: string
}

type StateKeys = keyof signUpLogInDataKey;
type adminInputKey = keyof adminSignUpLoginDataKey;

interface DispatchProps {
    loginSignUpDispatch: (data: loginSignUpUser) => void;
    signUpUserRequest: (data: loginSignUpUser) => void;
    logOutUserRequest: () => void;
    addUserCartData: (data: addUserCartProps) => void;
    signUpAdminRequest: (data: any) => void;
    addUserCartDataForFaceBook: (data: addUserCartProps) => void;
}

interface generalProps {
    routeProps: RouteComponentProps,
    signInbeforeCheckout?: boolean,
    controlSIgnupToggle?: () => void;
    signUpForBuyNow?: boolean,
    manageBuyNowState?: () => void;
}

interface rootState {
    loginUser: loggedInUser,
    cartInfo: {
        cartItem: AddToCartDataObj[] | []
    }
}

interface imageFileType {
    lastModified: number
    lastModifiedDate?: any
    name: string
    size: number
    type: string
    webkitRelativePath?: string
}

type Props = rootState & DispatchProps & generalProps;

class Header extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isOpen : false,
            signUpModal: false,
            logInModal: false,
            adminRegisterModal: false,
            tooltipOpen: false,
            tooltipOpenTech: false,
            signUpLogInData: {
                fullname: '',
                password: '',
                email: ''
            },
            adminSignUpLoginData: {
                name: '',
                eml: '',
                profession: '',
                selfDesc: '',
                password: '',
                selectedFile: null
            },
            adminSignUpErrorObj: {
                name: '',
                eml: '',
                profession: '',
                selfDesc: '',
                password: '',
                selectedFile: ''
            },
            errorObject: {
                fullname: '',
                email: '',
                password: '',
            },
            loginUser: {},
            categoryData: [],
            unAuthorize: '',
            existUserErr: '',
            searchValue: '',
            searchOption: [],
            allCourse: [],
            isLoggedInCancle: false
        }
    }

    redirectAtIndex = () => {
        this.props.routeProps.history.push({pathname:'/'});
    }

    openCart = () => {
        this.props.routeProps.history.push({pathname:'/cart/'});
    }

    appendNotification = () => {
        if(this.props.cartInfo.cartItem !== null) {
            let cartData = this.props.cartInfo.cartItem.length;
            if(cartData)
                return cartData;
        }
        return null;
    }

    onHandleChange = (event: React.FormEvent<HTMLInputElement>) => {
        let {name, value} = event.currentTarget;
        const { signUpLogInData } = this.state;

        this.setState({
            signUpLogInData:{
                ...signUpLogInData,
               [name]: value
            }
        });
    }

    adminHandleChange = (event: React.FormEvent<HTMLInputElement>) => {
        let {name, value} = event.currentTarget;
        const { adminSignUpLoginData } = this.state;

        if (name === 'selectedFile') {
            let fileData: imageFileType = event.currentTarget.files![0];
            this.setState({
                adminSignUpLoginData: {
                    ...adminSignUpLoginData,
                    [name]: fileData
                }
            });
        }

        else {
            this.setState({
                adminSignUpLoginData:{
                    ...adminSignUpLoginData,
                    [name]: value
                }
            });
        }
    }

    headerToggle = () => {
        this.setState(prevState => ({
            isOpen: !prevState.isOpen
        }));
    }

    //reset validation while open sign up & sign in dialog
    resetAllValidationAndClearValue = () => {
        let errorObject = {
            fullname: '',
            email: '',
            password: '',
        }
        let resetSignUpLogInData = {
            fullname: '',
            password: '',
            email: ''
        }
        this.setState({errorObject: errorObject, signUpLogInData: resetSignUpLogInData});
    }

    resetAllValidationAndClearValueForAdmin = () => {
        let adminErrorObject = {
            name: '',
            eml: '',
            profession: '',
            selfDesc: '',
            password: '',
            selectedFile: ''
        }
        let resetAdminSignUpLoginData = {
            name: '',
            eml: '',
            profession: '',
            selfDesc: '',
            password: '',
            selectedFile: null
        }
        this.setState({adminSignUpErrorObj: adminErrorObject, adminSignUpLoginData: resetAdminSignUpLoginData});
    };

    //resetAlert
    resetAlert = () => {
        this.setState({unAuthorize: '', existUserErr: ''});
    }

    //control signUp Model
    signUpToggle = () => {
        if (!this.state.signUpModal) {
            this.resetAllValidationAndClearValue();
            this.resetAlert();
        }
        this.setState(prevState => ({
            signUpModal: !prevState.signUpModal
        }));
        if (this.props.controlSIgnupToggle !== undefined) {
            this.props.controlSIgnupToggle();
        }
        if (this.props.manageBuyNowState) {
            this.props.manageBuyNowState!();
        }
    }

    //control logIn Model
    logInToggle = () => {
        if (!this.state.logInModal) {
            this.resetAllValidationAndClearValue();
            this.resetAlert();
        }
        this.setState(prevState => ({
            logInModal: !prevState.logInModal
        }));
    }

    signUpFromDetailCourse = () => {
        if (!this.state.signUpModal) {
            this.resetAllValidationAndClearValue();
            this.resetAlert();
            this.setState(prevState => ({
                signUpModal: !prevState.signUpModal
            }));
        }
    }

    adminToggle = () => {
        if (!this.state.adminRegisterModal) {
            this.resetAllValidationAndClearValueForAdmin();
            this.resetAlert();
        }

        this.setState(prevState => ({
            adminRegisterModal: !prevState.adminRegisterModal
        }));
    }

    onLinkAdmin = () => {
        this.openAdminRegister(); this.logInToggle();
    }

    //regex validation function
    specificRegexValidation = (inputField: StateKeys, fieldValue: string) => {
        switch (inputField) {
            case "email":
                return emailRegex.test(fieldValue)
            case "password":
                return passwordRegex.test(fieldValue)
            case "fullname":
                return fullNameRegex.test(fieldValue)
            default:
                return true;
        }
    }

    adminSpecificRegexValidation = (inputField: adminInputKey, fieldValue: string ) => {
        switch (inputField) {
            case "eml":
                return emailRegex.test(fieldValue)
            case "password":
                return passwordRegex.test(fieldValue)
            case "name":
                return fullNameRegex.test(fieldValue)
            case "selfDesc":
                return sentenseRegex.test(fieldValue)
            case "profession":
                return sentenseRegex.test(fieldValue)
            default:
                return true;
        }
    }

    adminFileRegexValidation = () => {
        if (this.state.adminSignUpLoginData.selectedFile) {
            let imgFile = this.state.adminSignUpLoginData.selectedFile;
            let extension = (imgFile!.name).substr((imgFile!.name).lastIndexOf('.')).toLowerCase();
            if(extension !== ".jpg" && extension !== ".jpeg" && extension !== ".bmp" &&
                extension !== ".gif" && extension !== ".png"){
                return false;
            }
            else {
                return true;
            }
        }
        else return false;
    }

    inputFieldValidation = (inputField: StateKeys) => {
        let notError = true;
        let setError = '';
        let errorObject = {...this.state.errorObject}
        const fieldValue = this.state.signUpLogInData[inputField];

        if (fieldValue !== '') {
            if (inputField !== 'password') {
                if (!this.specificRegexValidation(inputField, fieldValue)) {
                    setError = 'Invalid '+inputField;
                    notError = false;
                }
            }
            else {
                if (fieldValue.length >= 8 && fieldValue.length <= 12) {
                    if (!this.specificRegexValidation(inputField, fieldValue)) {
                        setError = 'Please enter one special character';
                        notError = false;
                    }
                }
                else {
                    setError = 'Enter minimum 8 or maximum 12 character';
                    notError = false;
                }
            }
        }
        else {
            setError = 'Enter '+ inputField;
            notError = false;
        }
        setError !== '' ?
        this.setState({errorObject: {...errorObject, [inputField]: setError}}):
            this.setState({errorObject: {...errorObject, [inputField]: ''}})
        return notError;
    }

    adminInputFieldValidation = (inputField: adminInputKey) => {
        let noError = true;
        let setError = '';
        let adminSignUpErrorObj = {...this.state.adminSignUpErrorObj}
        const fieldValue = this.state.adminSignUpLoginData[inputField];

        if (fieldValue !== '') {
            if (inputField !== 'password') {
                if ((inputField === 'eml' && (fieldValue.length <= 8 || fieldValue.length >= 35)) ||
                    (inputField === 'name' && (fieldValue.length <= 5 || fieldValue.length >= 30)) ||
                    (inputField === 'selfDesc' && (fieldValue.length <= 10 || fieldValue.length >= 300)) ||
                    (inputField === 'profession' && (fieldValue.length <= 10 || fieldValue.length >= 50))) {
                    if (inputField === 'eml' && (fieldValue.length <= 8 || fieldValue.length >= 35)) {
                        setError = 'Enter minimum 8 or maximum 35 character';
                        noError = false;
                    }
                    if (inputField === 'name' && (fieldValue.length <= 5 || fieldValue.length >= 30)) {
                        setError = 'Enter minimum 5 or maximum 30 character';
                        noError = false;
                    }
                    if (inputField === 'selfDesc' && (fieldValue.length <= 10 || fieldValue.length >= 300)) {
                        setError = 'Enter minimum 10 or maximum 300 character';
                        noError = false;
                    }
                    if (inputField === 'profession' && (fieldValue.length <= 10 || fieldValue.length >= 50)) {
                        setError = 'Enter minimum 10 or maximum 50 character';
                        noError = false;
                    }
                }
                else {
                    if (!this.adminSpecificRegexValidation(inputField, fieldValue)) {
                        setError = 'Invalid '+inputField;
                        noError = false;
                    }
                }
            }
            else {
                if (fieldValue.length >= 8 && fieldValue.length <= 12) {
                    if (!this.adminSpecificRegexValidation(inputField, fieldValue)) {
                        setError = 'Please enter one special character';
                        noError = false;
                    }
                }
                else {
                    setError = 'Enter minimum 8 or maximum 12 character';
                    noError = false;
                }
            }
        }
        else {
            setError = 'Enter '+ inputField;
            noError = false;
        }
        setError !== '' ?
            this.setState({adminSignUpErrorObj: {...adminSignUpErrorObj, [inputField]: setError}}):
            this.setState({adminSignUpErrorObj: {...adminSignUpErrorObj, [inputField]: ''}})
        return noError;
    }

    submitValidationChk = (submitFrom: string) => {
        let errorObject = {...this.state.errorObject};
        let fullnameResp;
        let fullNameErrorResp;
        let emailErrorResp;
        let passwordErrorResp;
        if (submitFrom === 'SignUp') {
            fullnameResp = this.inputFieldValidation("fullname");
            fullNameErrorResp = !fullnameResp && errorObject.fullname === '';
        }
        const emailResp = this.inputFieldValidation("email");
        emailErrorResp = !emailResp && errorObject.email === '';

        const passwordResp = this.inputFieldValidation("password");
        passwordErrorResp = !passwordResp && errorObject.password === '';

        if (submitFrom !== 'SignUp' && (!emailResp || !passwordResp)) {
            if (emailErrorResp)
                errorObject.email = "Enter email";
            if (passwordErrorResp)
                errorObject.password = "Enter password";
            this.setState({errorObject});
            return false;
        }
        else if (submitFrom === 'SignUp' && (!fullnameResp || !emailResp || !passwordResp)) {
                if (fullNameErrorResp)
                    errorObject.fullname = "Enter full name";
                if (emailErrorResp)
                    errorObject.email = "Enter email";
                if (passwordErrorResp)
                    errorObject.password = "Enter password";
                this.setState({errorObject});
                return false;
        }
        else return true;
    }

    adminSubmitValidationChk = (submitFrom: string) => {
        let adminSignUpErrorObj = {...this.state.adminSignUpErrorObj};
        let fullnameResp;
        let professionResp;
        let selfDescResp;
        let imgFileResp;
        let fullNameErrorResp;
        let emailErrorResp;
        let passwordErrorResp;
        let professionErrorResp;
        let imgFileErrorResp;
        let selfDescErrorResp;
        if (submitFrom === 'AdminSignUp') {
            fullnameResp = this.adminInputFieldValidation("name");
            fullNameErrorResp = !fullnameResp && adminSignUpErrorObj.name === '';

            professionResp = this.adminInputFieldValidation("profession");
            professionErrorResp = !professionResp && adminSignUpErrorObj.profession === '';

            selfDescResp = this.adminInputFieldValidation("selfDesc");
            selfDescErrorResp = !selfDescResp && adminSignUpErrorObj.selfDesc === '';

            imgFileResp = this.adminFileRegexValidation();
            imgFileErrorResp = !imgFileResp && adminSignUpErrorObj.selectedFile === '';
        }
        const emailResp = this.adminInputFieldValidation("eml");
        emailErrorResp = !emailResp && adminSignUpErrorObj.eml === '';

        const passwordResp = this.adminInputFieldValidation("password");
        passwordErrorResp = !passwordResp && adminSignUpErrorObj.password === '';

        if (submitFrom === 'AdminSignUp' && (!fullnameResp || !emailResp || !passwordResp || !professionResp || !selfDescResp || !imgFileResp)) {
            if (fullNameErrorResp)
                adminSignUpErrorObj.name = "Enter full name";
            if (emailErrorResp)
                adminSignUpErrorObj.eml = "Enter email";
            if (passwordErrorResp)
                adminSignUpErrorObj.password = "Enter password";
            if (professionErrorResp)
                adminSignUpErrorObj.profession = "Enter profession";
            if (selfDescErrorResp)
                adminSignUpErrorObj.selfDesc = "Enter self description";
            if (imgFileErrorResp) {
                adminSignUpErrorObj.selectedFile = "Select image file";
            }
            this.setState({adminSignUpErrorObj});
            return false;
        }
        else return true;
    }

    //signUp submit
    btnSignUp = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        const submitValidationResp = this.submitValidationChk('SignUp');
        if (submitValidationResp) {
            // let addRoleInUserData = {...this.state.signUpLogInData}
            // addRoleInUserData = {
            //     fullname: addRoleInUserData.fullname,
            //     email: addRoleInUserData.email,
            //     password: addRoleInUserData.password
            // };
            this.props.signUpUserRequest({...this.state.signUpLogInData, role: '0'});
        }
    }

    //logIn submit
    btnLogIn = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        const submitValidationResp = this.submitValidationChk('LogIn');
        if (submitValidationResp) {
            this.props.loginSignUpDispatch(this.state.signUpLogInData);
        }
    }

    btnAdminSignUp = () => {
        const submitValidationResp = this.adminSubmitValidationChk('AdminSignUp');
        if (submitValidationResp) {
            const {name, eml, password, selfDesc, profession, selectedFile} = this.state.adminSignUpLoginData;
            const courses: number = 0;
            const data = new FormData();

            data.append('name', name);
            data.append('email', eml);
            data.append('profession', profession);
            data.append('selfDescription', selfDesc);
            // @ts-ignore
            data.append('courses', courses);
            data.append('password', password);
            // @ts-ignore
            data.append('instructorImage', selectedFile);
            this.props.signUpAdminRequest(data);

        }
    }

    //admin registeration
    openAdminRegister = () => {
        if(!this.state.adminRegisterModal){
            this.setState(prevState => ({
                tooltipOpen: !prevState.tooltipOpen
            }))
        }
        this.adminToggle();
    }

    //logout user
    logoutUser = async () => {
        await this.props.logOutUserRequest();
        this.props.routeProps.history.push(`/`);
    }

    //alternate signUp and logIn toggle
    signUpOrLoginToggle = () => {
        this.signUpToggle();
        this.logInToggle()
    }

    handleGenreSelect = (event: any, selectedElement: string[]) => {
        if(localStorage.getItem('topic') !== null) {
            let topicData: string[] = [];
            localStorage.setItem('topic', JSON.stringify(topicData));
        }
        this.props.routeProps.history.push(`/${selectedElement[1]}`, `${selectedElement[0]}`);
    }

    // searchCategory = (inputValue: string) => {
    //     let that = this;
    //     let searchArray: string[] | [] = [];
    //     const { categoryData } = this.state;
    //
    //     return 1;
    // }

    setSelectedValue = (elementName: string) => {
        if(this.state.searchValue !== elementName){
            this.setState({searchValue : elementName,searchOption:[]})
        }
    }

    handleChange = (e: React.FormEvent<HTMLInputElement>,searchValue: string) => {
        let searchArray: string[] | [] = [];
        let inputValue: any = e.currentTarget.value;
        const { categoryData } = this.state;

        if(inputValue !== "") {
            let searchCategory = (categoryData: categories[]) => {
                categoryData.map(function (element,key) {
                    if(element.subcategory && element.subcategory.length){
                        if(((element.name.toLowerCase()).indexOf(inputValue.toLowerCase()))>-1){

                            // @ts-ignore
                            searchArray.push(element.name);
                        }
                        searchCategory(element.subcategory)
                    }
                    else{
                        if(((element.name.toLowerCase()).indexOf(inputValue.toLowerCase()))>-1){
                            // @ts-ignore
                            searchArray.push(element.name);
                        }
                    }
                    return 0;
                });

            }
            searchCategory(categoryData);

            this.state.allCourse.map(function (course,index) {
                if(specialCharacterRegex.test(inputValue)) {
                    for (let i=0; i<inputValue.length; i++) {
                        if(inputValue[i]>='A' && inputValue[i]<='Z')
                            inputValue[i] = inputValue[i] + 32;
                        }
                    debugger
                }
                else inputValue = inputValue.toLowerCase();
                if(course.course_Name.toLowerCase().search(inputValue) !== -1){
                    // @ts-ignore
                    searchArray.push(course.course_Name);
                }
                return true;
            });
        }
        this.setState({searchValue : inputValue,searchOption:searchArray.slice(0)})
    }

    searchContent = (e: React.FormEvent<HTMLInputElement>) => {
        let searchableCourse: fullCourseData[];
        let searchFlag = 0;
        const that = this;
        const { categoryData } = this.state;
        if(this.state.searchValue) {
            let searchCategory = (categoryData: categories[]) => {
                categoryData.map(function (element,key) {
                    console.log('loop one execution: ', categoryData);
                    if(element.subcategory && element.subcategory.length) {
                        if(element.name.toLowerCase() === that.state.searchValue.toLowerCase()){
                            searchFlag = 1;
                            that.props.routeProps.history.push({pathname:'/courses/',state:element.name});
                        }
                        searchCategory(element.subcategory)
                    }
                    else{
                        if(element.name.toString().toLowerCase() === that.state.searchValue.toString().toLowerCase()){
                            searchFlag = 1;
                            that.props.routeProps.history.push({pathname:'/topic/',state:element.name});
                        }
                    }
                    return 0;
                });
            }
            searchCategory(categoryData);
            searchableCourse = [];
            if(!searchFlag){
                this.state.allCourse.map(function (course,index) {
                    console.log('loop two execution: ', categoryData);
                    if(course.course_Name.toLowerCase().search(that.state.searchValue.toLowerCase()) !== -1){
                        searchFlag = 1;
                        searchableCourse.push(course);
                    }
                    return true;
                });
            }
            if(!searchFlag){
                this.state.allCourse.map(function (course,index) {
                    console.log('loop three execution: ', categoryData);
                    if(course.created_By[0].toString().toLowerCase().search(that.state.searchValue.toString().toLowerCase()) !== -1){
                        searchFlag = 1;
                        searchableCourse.push(course);
                    }
                    return true;
                });
            }
            if(searchableCourse.length > 0){
                console.log('forth execution: ', categoryData);
                this.props.routeProps.history.push({pathname:`/search/`,state:searchableCourse});
            }
            else if (searchableCourse.length === 0 && !searchFlag) {
                debugger
                console.log('fifth execution: ', categoryData);
                this.props.routeProps.history.push({pathname:`/search/`,state:this.state.searchValue});
            }
        }
        else {
            this.props.routeProps.history.push({pathname:'/'});
        }
        this.setState({searchValue:'',searchOption:[]});
    }

    appendDynamicCategoryData = (category: categories[]) => {
        let that = this;
        if (category.length > 0 ){
            return category.map(function (element) {
                return (
                    element.subcategory && element.subcategory.length ?
                        <SubMenu title={element.name} key={element.name} onTitleClick={(event) => that.handleGenreSelect(event, [element.name,"courses"])}>
                            {that.appendDynamicCategoryData(element.subcategory)}
                        </SubMenu>
                        :
                        (<Menu.Item key={element.name} onClick={(event) => that.handleGenreSelect(event, [element.name,"topic"])}>{element.name}</Menu.Item>)
                );
            });
        }
    };

    toggle = (tooltip: string) => {
        if (tooltip === 'tooltipOpen') {
            this.setState({
                [tooltip]: !this.state[tooltip]
            });
        }
        else if(tooltip === 'tooltipOpenTech'){
            this.setState({
                [tooltip]: !this.state[tooltip]
            });
        }
    }

    menu = () => {
        return(
            this.state.categoryData? (
                <Menu>
                    {this.appendDynamicCategoryData(this.state.categoryData)}
                </Menu>
            ) : null
        )
    };

    componentDidMount() {
        getAllCategory((err: object, response: categories[]) => {
            if (response) {
                this.setState({categoryData: response});
            }
        });

        getAllCourse((err: object, response: fullCourseData[]) => {
            if (response) {
                this.setState({allCourse: response});
            }
        });
    }

    async componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        if (prevProps.loginUser !== this.props.loginUser) {
            if (this.props.loginUser && ('message' in this.props.loginUser) && this.props.loginUser.message !== 'logged out') {
                if (this.props.loginUser.message === 'email is already exist') {
                    this.setState({existUserErr: 'user is already exist' || 'undefined'});
                }
                else this.setState({unAuthorize: this.props.loginUser.message || 'undefined'});
            }
            else if (this.props.loginUser && !('message' in this.props.loginUser)){

                if (this.state.logInModal) {
                    this.logInToggle();
                }
                else if (this.state.signUpModal) {
                    this.signUpToggle();
                }
                else if(this.state.adminRegisterModal) {
                    this.adminToggle();
                }
                if (this.props.loginUser.role === '1') {
                    this.props.routeProps.history.push({pathname:'/adminpenal/'})
                }
                else {
                    if (!('cartData' in this.props.loginUser)) {
                        let localCartData = JSON.parse(String(localStorage.getItem("addToCart")));
                        if(localCartData){
                            let u_id = this.props.loginUser._id;
                            let cartData = localCartData;
                            let passDataObject = {u_id,cartData};
                            if ('loginWithFacebook' in this.props.loginUser) {
                                this.props.addUserCartDataForFaceBook(passDataObject)
                            }
                            else await (this.props.addUserCartData(passDataObject));
                        }
                    }
                }
            }
        }

        if (JSON.stringify(prevState.categoryData) !== JSON.stringify(this.state.categoryData)) {
            getAllCategory((err: object, response: categories[]) => {
                if (response) {
                    this.setState({categoryData: response});
                }
            });
        }
        if (JSON.stringify(prevState.allCourse) !== JSON.stringify(this.state.allCourse)) {
            getAllCourse((err: object, response: fullCourseData[]) => {
                if (response) {
                    this.setState({allCourse: response});
                }
            });
        }
        if (this.props.signInbeforeCheckout !== undefined && this.props.signInbeforeCheckout && !this.state.signUpModal) {
            this.setState(prevState => ({
                signUpModal: !prevState.signUpModal
            }));
        }

        if (this.props.signUpForBuyNow) {
            this.signUpFromDetailCourse();
        }
    }

    render() {
        let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
        const {isOpen, signUpModal, logInModal, signUpLogInData, errorObject, unAuthorize, existUserErr, adminSignUpLoginData, adminSignUpErrorObj} = this.state;
        const {email, password} = signUpLogInData;
        // @ts-ignore
        // @ts-ignore
        return (
            <div className="header-custom">
                <Navbar color="light" light expand="md" className='w-100 navbar-main-wrap'>
                    <NavbarBrand onClick={this.redirectAtIndex}><img src={logo} alt={"udemy"} width="110" height="32"/></NavbarBrand>
                    <NavbarToggler onClick={this.headerToggle} />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav navbar className='align-items-center w-100'>
                            <UncontrolledDropdown nav inNavbar>
                                <Dropdown overlay={this.menu}>
                                    <a href = "/" className="ant-dropdown-link header-cat">
                                        Categories <Icon type="down"/>
                                    </a>
                                </Dropdown>
                            </UncontrolledDropdown>
                            <NavItem className='navitem-width'>
                                <InputGroup className="d-flex input-wrap" id="wrapedInput">
                                    <div className="AutoCompleteText">
                                        <Input className="searchBar" type="text" id="searchInput" onChange = {(event) => this.handleChange(event,'searchValue')}
                                               value = {this.state.searchValue || ''}/>

                                        {this.state.searchOption.length > 0 ?
                                            (<ul className="searchableList">
                                                {
                                                    this.state.searchOption.map((elementName, index) =>
                                                        <li key={index} onClick={() => this.setSelectedValue(elementName)}>{elementName}</li>)
                                                }
                                            </ul>)
                                            : null
                                        }
                                    </div>
                                    <InputGroupAddon addonType="append" id="searchContent">
                                        <Button color="white" onClick={(event) => this.searchContent(event)}><SearchOutlined/></Button>
                                    </InputGroupAddon>
                                </InputGroup>
                            </NavItem>
                            <NavItem className='navitem-width'>
                                <NavLink>
                                    <Button id="PopoverClick" type="button">
                                        Udemy for Business
                                    </Button>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink >
                                    <Button id="PopoverLegacy" type="button">
                                        Teach on Udemy
                                    </Button>
                                </NavLink>
                            </NavItem>
                            {this.props.loginUser !== null && this.props.loginUser.role === '1' ? null
                                :
                                (<NavItem>
                                    <a onClick={this.openCart.bind(this)} className="notification"><img
                                        className="icon " alt="1" src={cartImg}/>
                                        <span className="badge">{this.appendNotification()}</span>
                                    </a>
                                </NavItem>)
                            }
                            {(Object.keys(loggedInUser).length > 0) ? (
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle>
                                        {loggedInUser.name.charAt(0).toUpperCase()}
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <DropdownItem onClick={this.logoutUser}>
                                            Logout
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            ) : (
                                <>
                                    <NavItem>
                                            <NavLink className="cart"><Button className='btn-custom login mr-2 bg-white login-css btn-secondary1' onClick={this.logInToggle}>log in</Button>
                                            </NavLink>
                                    </NavItem>
                                    <NavItem>
                                            <NavLink className="cart"><Button className='btn-custom login border-0' onClick={this.signUpToggle}>Sign Up</Button>
                                            </NavLink>
                                    </NavItem>
                                </>
                            )}
                        </Nav>
                    </Collapse>
                </Navbar>
                <AdminRegister isOpen = {this.state.adminRegisterModal}
                               toggle={this.openAdminRegister}
                               onlinkclick = {this.onLinkAdmin}
                               adminHandleChange = {(event) => this.adminHandleChange(event)}
                               signUpData = {adminSignUpLoginData}
                               existUserErr = {existUserErr}
                               adminSignUpError = {adminSignUpErrorObj}
                               adminOnBlurFunction = {this.adminInputFieldValidation}
                               btnAdminSignUp = {this.btnAdminSignUp} />
                <SignUp signUpModalProps = {signUpModal}
                        signUpToggle = {this.signUpToggle}
                        btnSignUp = {(event) => this.btnSignUp(event)}
                        loginLinkInSignUp = {this.signUpOrLoginToggle}
                        onBlurFunction = {this.inputFieldValidation}
                        onHandleChange = {(event) => this.onHandleChange(event)}
                        signUpData = {signUpLogInData}
                        existUserErr = {existUserErr}
                        errorObject = {errorObject}/>
                <LogIn logInModalProps = {logInModal}
                       logInToggle = {this.logInToggle}
                       btnLogIn = {(event) => this.btnLogIn(event)}
                       signUpLinkInLogIn = {this.signUpOrLoginToggle}
                       onBlurFunction = {this.inputFieldValidation}
                       onHandleChange = {(event) => this.onHandleChange(event)}
                       LogInData = {{email, password}}
                       unAuthorize = {unAuthorize}
                       errorObject = {errorObject}
                />

                <Tooltip className="tooltip-color" placement="top" isOpen={this.state.tooltipOpen} autohide={false} target="PopoverClick" toggle={this.toggle.bind(this,"tooltipOpen")}>
                        <span>Get your team access to 3,500+ top<br/>
                            Udemy courses anytime, anywhere</span>
                    {('loginDetail' in this.props.loginUser || 'message' in this.props.loginUser)?
                        (<a onClick={this.openAdminRegister}><div className="linkFont">Try Udemy for Business</div></a>)
                        : null
                    }
                </Tooltip>
                <Tooltip placement="top" isOpen={this.state.tooltipOpenTech} autohide={false} target="PopoverLegacy" toggle={this.toggle.bind(this,"tooltipOpenTech")}>
                        <span>Turn what you know into an opportunity<br />
                            and reach millions around the world.</span>
                    <a className="linkFont" onClick={()=> window.open("https://www.udemy.com/teaching/?ref=teach_header", "_blank")}><div className="linkFont">Learn more</div></a>
                </Tooltip>
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => {
    const {loginUser, cartInfo} = state;
    return {
        loginUser: loginUser,
        cartInfo: cartInfo
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, void, Action>) => {
    return  {
        loginSignUpDispatch: bindActionCreators(loginUserRequest, dispatch),
        logOutUserRequest: bindActionCreators(logOutUserRequest, dispatch),
        signUpUserRequest: bindActionCreators(signUpUserRequest, dispatch),
        addUserCartData: bindActionCreators(addUserCartData, dispatch),
        addUserCartDataForFaceBook: bindActionCreators(addUserCartDataForFaceBook, dispatch),
        signUpAdminRequest: bindActionCreators(signUpAdminRequest, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);