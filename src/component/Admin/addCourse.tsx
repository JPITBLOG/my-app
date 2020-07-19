import React,{Component, MouseEvent} from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {addcourseData} from '../../action/courses';
import {getAllInstructor} from '../../action/instructor';
import {getAllSubcategoriesData} from '../../action/categories';
import { Button, Form, FormGroup, Label, Input, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,Alert, Col } from 'reactstrap';
import Multiselect from 'react-multi-select-component';
import '../../component/App/App.css';
import './addCourse.css';
import AdminavBar from "./adminNaveBar";
import {instructors} from "../../interfaces/instructor";
import {subCategories} from "../../interfaces/category";

import Header from "../Header/header";

interface Prop {
    contentNameid: string,
    contentDescid: string
}

interface State {

}

class Content extends Component<Prop, State>{
    render(){
        return(
            <FormGroup row>
                <Col sm={1}></Col>
                <Label for="learn" sm={2}>Conten</Label>
                <Col sm={4}>
                    <Input type="text" name="contentName" id={this.props.contentNameid} />
                    <Input type="textarea" name="subContent" id={this.props.contentDescid} />
                </Col >
            </FormGroup>
        );
    }
}

interface instructorMappedObj {
    label: string,
    value: string,
    _id?: string | undefined
}

interface errorObject {
    technology?: string,
    instructor?: string,
    course_Name?: string,
    course_Subtitle?: string,
    learn?: string,
    courseContent?: string,
    requirement?: string,
    description?: string,
    price?: string,
    offer?: string
}

interface addCourseProp {
    routeProps: RouteComponentProps
}

interface courseContentTYpeObj {
    content_Name: string,
    sub_Content: string[]
}

interface addCourseState {
    instructor: instructorMappedObj[],
    techId: {selected: string, _id: string},
    course_Name: string | null,
    course_Subtitle: string | null,
    learn: string | null,
    courseContent: courseContentTYpeObj[],
    requirement: string | null,
    description: string | null,
    price: string | null,
    offer: string | null,
    inputs: string[],
    Alert: number,
    errors: errorObject,
    editFlag: number,
    allSubCategory: subCategories[],
    allInstructors: instructors[]
}

class AddCourse extends Component<addCourseProp, addCourseState>{
    private instructor_id: string[] | [] = [];
    private instructorArray: instructors[] = [];
    private SubcategoryMapped: any[] = [];
    private instructorMapped: instructorMappedObj[]  = [];
    constructor(props: addCourseProp){
        super(props);
        this.state = {techId : {selected:'',_id:''},
            instructor : [],
            course_Name : null,
            course_Subtitle : null,
            learn : null,
            courseContent : [],
            requirement : null,
            description : null,
            price : null,
            offer : null,
            inputs: ['input-0'],
            Alert: 0,
            errors: {},
            editFlag : 0,
            allSubCategory: [],
            allInstructors: []
        };
        this.ontopic = this.ontopic.bind(this);
        this.course_submit = this.course_submit.bind(this);
        this.result = this.result.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    ontopic = (e: React.FormEvent<HTMLSelectElement>,selected: string,_id: string) => {
        e.preventDefault();
        this.setState({techId:{selected,_id}})
    }

    handleChange = (e: React.FormEvent<HTMLInputElement>,statename: string) => {
        this.setState({...this.state,[statename] : e.currentTarget.value});
    }

    result = (params: instructorMappedObj[]) => {
        this.setState({instructor : params})
    }

    handleValidation = () => {
        let numFormat = /^[0-9]+$/;
        let errors: errorObject = {};
        let formIsValidate = true;
        let technology = this.state.techId.selected;
        let instructor = this.state.instructor;
        let course_Name = this.state.course_Name;
        let course_Subtitle = this.state.course_Subtitle;
        let learn = this.state.learn;
        let requirement = this.state.requirement;
        let description = this.state.description;
        let price = this.state.price;
        let offer = this.state.offer;
        let courseContent = this.state.courseContent;

        //technology
        if(technology === ''){
            errors["technology"] = "please select technology";
            formIsValidate = false;
        }

        //instructor
        if(instructor == null){
            errors["instructor"] = "please select instructor";
            formIsValidate = false;
        }

        //courseName
        if(course_Name == null || course_Name.length < 5){
            if(course_Name == null){
                errors["course_Name"] = "Cannot be empty";
            }
            else if(course_Name.length < 5){
                errors["course_Name"] = "required atleast 5 character";
            }
            formIsValidate = false;
        }
        //courseSubtitle
        if(course_Subtitle == null || course_Subtitle.length < 5){
            if(course_Subtitle == null){
                errors["course_Subtitle"] = "Cannot be empty";
            }
            else if(course_Subtitle.length < 5){
                errors["course_Subtitle"] = "required atleast 5 character";
            }
            formIsValidate = false;
        }
        //learn
        if(learn == null || learn.length < 10){
            if(learn == null){
                errors["learn"] = "Cannot be empty";
            }
            else if(learn.length < 10){
                errors["learn"] = "required atleast 10 character";
            }
            formIsValidate = false;
        }

        //content
        if(courseContent.length){
            if(courseContent[0]){
                if(!("content_Name" in courseContent[0]) || !("content_Name" in courseContent[0])){
                    errors["courseContent"] = "Cannot be empty";
                    formIsValidate = false;
                }
            }
        }
        else {
            errors["courseContent"] = "Cannot be empty";
            formIsValidate = false;
        }

        //requirement
        if(requirement == null || requirement.length < 15){
            if(requirement == null){
                errors["requirement"] = "Cannot be empty";
            }
            else if(requirement.length < 15){
                errors["requirement"] = "required atleast 15 character";
            }
            formIsValidate = false;
        }

        //description
        if(description == null || description.length < 15){
            if(description == null){
                errors["description"] = "Cannot be empty";
            }
            else if(description.length < 15){
                errors["description"] = "required atleast 15 character";
            }
            formIsValidate = false;
        }

        //price
        if(price == null || price.length > 0){
            if(price == null){
                errors["price"] = "Cannot be empty";
            }
            else if(price.length > 2){
                if(!price.match(numFormat)){
                    errors["price"] = "required numbar value";
                    formIsValidate = false;
                }
            }
            else if(price.length! > 2){
                errors["price"] = "required atleast 3 numeric value";
                formIsValidate = false;
            }

        }

        //offer
        if(offer == null || offer.length > 0){
            if(offer == null){
                errors["offer"] = "Cannot be empty";
                formIsValidate = false;
            }
            else if(offer.length > 0){
                if(!offer.match(numFormat)){
                    errors["offer"] = "required numbar value";
                    formIsValidate = false;
                }
            }

        }

        this.setState({errors:errors});
        return formIsValidate;
    }

    course_submit = async (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        if(this.handleValidation()){
            let learn = null;
            let requirement = null;
            this.instructor_id = [];
            const that = this;
            let category_Id = this.state.techId._id;
            let category_Name = this.state.techId.selected;
            this.instructorArray.map(function (instructorObj,index) {
                that.state.instructor.map(function (instructSelect: instructorMappedObj) {
                    if(instructorObj._id === instructSelect._id){
                        if (instructorObj._id) {
                            // @ts-ignore
                            that.instructor_id.push(instructorObj._id);
                        }
                    }
                    return true;
                })
                return true;
            })
            let created_By = this.instructor_id;
            let language = "English";
            let course_Name = this.state.course_Name;
            let course_Subtitle = this.state.course_Subtitle;
            if(this.state.learn!.includes(","))
                learn = this.state.learn!.split(",");
            else
                learn = [this.state.learn];
            let course_content = this.state.courseContent;
            if(this.state.requirement!.includes(","))
                requirement =  this.state.requirement!.split(",");
            else
                requirement = [this.state.requirement];
            let description = this.state.description;
            let price = this.state.price;
            let offer = this.state.offer;
            let passDataObject = {category_Id,category_Name,created_By,language,course_Name,course_Subtitle,
                learn,course_content,requirement,description,price,offer}
            let addCourseResp = await addcourseData(passDataObject);
            if(addCourseResp){
                this.instructor_id = [];
                this.instructorMapped = [];
                this.setState({techId : {selected:'',_id:''},
                    instructor : [],
                    course_Name : null,
                    course_Subtitle : null,
                    learn : null,
                    courseContent : [],
                    requirement : null,
                    description : null,
                    price : null,
                    offer : null,
                    inputs: ['input-0'],
                    Alert: 1});
                let currentAppendId = this.state.inputs.length - 1;
                // @ts-ignore
                document.getElementById('cname'+currentAppendId).value = '';
                // @ts-ignore
                document.getElementById('cdesc'+currentAppendId).value = '';
                this.props.routeProps.history.push({pathname:'/adminpenal/addcourse/addvideo/',state:course_Name});
            }
        }
    }

    async componentDidMount() {
        await getAllSubcategoriesData((err: object, response: subCategories[]) => {
            if (response) {
                this.setState({allSubCategory: response});
            }
        });

        await getAllInstructor((err: object, response: instructors[] | []) => {
            if (response) {
                this.setState({allInstructors: response});
            }
        });
    }

    async componentDidUpdate(prevProps: Readonly<addCourseProp>, prevState: Readonly<addCourseState>, snapshot?: any) {
        if (JSON.stringify(prevState.allSubCategory) !== JSON.stringify(this.state.allSubCategory)) {
            await getAllSubcategoriesData((err: object, response: subCategories[]) => {
                if (response) {
                    this.setState({allSubCategory: response});
                }
            });
        }

        if (JSON.stringify(prevState.allInstructors) !== JSON.stringify(this.state.allInstructors)) {
            await getAllInstructor((err: object, response: instructors[] | []) => {
                if (response) {
                    this.setState({allInstructors: response});
                }
            });
        }
    }

    render(){
        const that = this;
        this.instructorMapped = [];
        this.SubcategoryMapped = [];
        if(this.state.allSubCategory.length > 0){
            this.state.allSubCategory.map(function (subcategory,index) {
                that.SubcategoryMapped.push(
                    <DropdownItem disabled>{subcategory.subcategory? subcategory.subcategory : null}</DropdownItem>,
                    subcategory.subcategoryArray.map(function (subTopic,index) {
                        if(subTopic.slice(0,3) !== "All"){
                            return (<DropdownItem onClick={(event) => {that.ontopic(event,subTopic,subcategory._id)}}>{subTopic}</DropdownItem>);
                        }
                        return true;
                    }),
                    <DropdownItem divider />
                )
                return true;
            });
        }

        if(this.state.allInstructors.length >0){
            this.instructorArray = this.state.allInstructors;
            this.instructorArray.map(function (instructor,index) {
                that.instructorMapped.push({"label":instructor.name, "value":instructor._id!, "_id":instructor._id});
                return true;
            })
        }

        return(
            <div>
                <Header routeProps={this.props.routeProps}/>
                <AdminavBar routeProps={this.props.routeProps} />
                {this.state.Alert === 1 ? (<Alert color="success">course added successfully!</Alert>) :
                    null }

                <Form id = "addCourseForm">
                    <FormGroup row>
                        <Col sm={1}></Col>
                        <Col sm={2}>
                            <h4>Add Course</h4>
                        </Col>
                    </FormGroup>
                    <FormGroup row className="addform">
                        <Col sm={1}></Col>
                        <Label for="exampleEmail" sm={2}> Select Technology</Label>
                        <Col sm={1}>
                        <UncontrolledDropdown>
                            <DropdownToggle caret>
                                Technology
                            </DropdownToggle>
                            <DropdownMenu>
                                {this.SubcategoryMapped}
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        </Col>
                        <Col sm={3}>
                            <Input type="text" name="selectedTech" id="selectedTech" value={this.state.techId.selected || ''}/>
                            <span style={{color: "red"}}>{this.state.errors["technology"]}</span>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm={1}></Col>
                        <Label for="examplePassword" sm={2}>Instructor</Label>
                        <Col sm={4}>
                        <div className="App">
                            <Multiselect  labelledBy={"Select"}  options={this.instructorMapped} value={this.state.instructor} onChange={this.result} />
                            <span style={{color: "red"}}>{this.state.errors["instructor"]}</span>
                        </div>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm={1}></Col>
                        <Label for="examplePassword" sm={2}>Course-Name</Label>
                        <Col sm={4}>
                        <Input onChange = {(event) => this.handleChange(event,'course_Name')} value={this.state.course_Name || ''} type="text" name="course_name" id="course_name"/>
                        <span style={{color: "red"}}>{this.state.errors["course_Name"]}</span>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm={1}></Col>
                        <Label for="examplePassword" sm={2}>Course-Subtitle</Label>
                        <Col sm={4}>
                        <Input onChange = {(event) => this.handleChange(event,'course_Subtitle')} value={this.state.course_Subtitle || ''} type="text" name="course_title" id="course_title" />
                        <span style={{color: "red"}}>{this.state.errors["course_Subtitle"]}</span>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm={1}></Col>
                        <Label for="learn" sm={2}>What you'll learn</Label>
                        <Col sm={4}>
                        <Input onChange = {(event) => this.handleChange(event,'learn')} value={this.state.learn || ''} type="textarea" name="learn" id="learn" />
                        <span style={{color: "red"}}>{this.state.errors["learn"]}</span>
                        </Col>
                    </FormGroup>
                    <div>
                        <div id="dynamicInput">
                            {this.state.inputs.map((input,index) => <Content contentNameid = {'cname'+index}
                                                                             contentDescid = {'cdesc'+index}key={input} />)}
                                                                             <FormGroup row>
                                                                                <Col sm={1}></Col>
                                                                                <Col sm={2}></Col>
                                                                                 <Col sm={4}>
                                                                                    <span style={{color: "red"}}>{this.state.errors["courseContent"]}</span>
                                                                                 </Col>
                                                                             </FormGroup>

                        </div>
                        <FormGroup row>
                            <Col sm={1}></Col>
                            <Col sm={2}></Col>
                            <Col sm={4}>
                            <button onClick={ (e) => this.appendInput(e,null) }>
                                SUBMIT
                            </button>
                            <button onClick={ (e) => this.appendInput(e,"addInput") }>
                                ADD ANOTHER INPUT
                            </button>
                            </Col>
                        </FormGroup>
                        </div>
                    <FormGroup row>
                        <Col sm={1}></Col>
                        <Label for="learn" sm={2}>Setup Requirement</Label>
                        <Col sm={4}>
                        <Input onChange = {(event) => this.handleChange(event,'requirement')} value={this.state.requirement || ''} type="textarea" name="setup" id="setup" />
                        <span style={{color: "red"}}>{this.state.errors["requirement"]}</span>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm={1}></Col>
                        <Label for="learn" sm={2}>Description</Label>
                        <Col sm={4}>
                        <Input onChange = {(event) => this.handleChange(event,'description')} value={this.state.description || ''} type="textarea" name="desc" id="desc" />
                        <span style={{color: "red"}}>{this.state.errors["description"]}</span>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm={1}></Col>
                        <Label for="price" sm={2}>Price</Label>
                        <Col sm={4}>
                        <Input onChange = {(event) => this.handleChange(event,'price')} value={this.state.price || ''} type="text" name="price" id="price" />
                        <span style={{color: "red"}}>{this.state.errors["price"]}</span>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm={1}></Col>
                        <Label for="offer" sm={2}>Offer</Label>
                        <Col sm={4}>
                        <Input onChange = {(event) => this.handleChange(event,'offer')} value={this.state.offer || ''} type="text" name="offer" id="offer" />
                        <span style={{color: "red"}}>{this.state.errors["offer"]}</span>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                    <Col sm={1}></Col>
                    <Col sm={2}></Col>
                    <Col sm={4}>
                        <Button onClick={(event) => {this.course_submit(event)}}>Submit</Button>
                    </Col>
                    </FormGroup>
                    </Form>
            </div>
        );
    }

    appendInput(e: MouseEvent<HTMLElement>,submitType: string | null) {
        e.preventDefault();
        let descArray = null;
        let currentAppendId = this.state.inputs.length - 1;
        // @ts-ignore
        let cname = document.getElementById('cname'+currentAppendId).value;
        // @ts-ignore
        let cdesc = document.getElementById('cdesc'+currentAppendId).value;
        if(cdesc.includes(","))
            descArray = cdesc.split(",");
        else
            descArray = [cdesc];
        this.setState({courseContent:[...this.state.courseContent,{"content_Name":cname,"sub_Content":descArray}]})
        if(submitType === "addInput"){
            let newInput = `input-${this.state.inputs.length}`;
            this.setState(prevState => ({ inputs: prevState.inputs.concat([newInput])}));
        }
    }
}

export default AddCourse;