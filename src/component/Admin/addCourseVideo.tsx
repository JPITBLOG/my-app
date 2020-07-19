import React,{Component, MouseEvent} from 'react';
import { Button,
        Form,
        FormGroup,
        Label,
        Alert,
        Col,
        FormFeedback} from "reactstrap";
import AdminavBar from './adminNaveBar';
import {getAllCourse, addcourseVideo} from "../../action/courses";
import {fullCourseData} from "../../interfaces/CourseInDetailComponent";
import {RouteComponentProps} from "react-router-dom";
import Header from "../Header/header";

interface Prop {
    routeProps: RouteComponentProps
}

interface fileAttribute {
    lastModified: number,
    lastModifiedDate?: any
    name: string,
    size: number,
    type: string,
    webkitRelativePath?: string
}

interface State {
    allCourse: fullCourseData[],
    displayImg: fileAttribute | null,
    displayVideo: fileAttribute | null,
    errorObj: {
        displayImg: string,
        displayVideo: string
    },
    Alert: number,
    loaded: number
}

class AddcourseVideo extends Component<Prop, State> {
    private fileInput: HTMLInputElement | null;
    constructor(props: Prop){
        super(props)
        this.state = {
            allCourse: [],
            displayImg: null,
            displayVideo: null,
            errorObj: {
                displayImg: '',
                displayVideo: ''
            },
            Alert : 0,
            loaded: 0
        }
        this.video_submit = this.video_submit.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.fileInput = null;
    }

    onChangeHandler = (event: React.FormEvent<HTMLInputElement>, inputField: string) => {
        this.setState({
            ...this.state,[inputField]: event.currentTarget.files![0]
        });
    }

    FileRegexValidation = (inputField: string) => {
        // @ts-ignore
        if (this.state[inputField]) {
            // @ts-ignore
            let File = this.state[inputField];
            let extension = (File!.name).substr((File!.name).lastIndexOf('.')).toLowerCase();
            debugger
            // @ts-ignore
            if(inputField === 'displayImg' && extension !== ".jpg" && extension !== ".jpeg" && extension !== ".bmp" &&
                extension !== ".gif" && extension !== ".png"){
                debugger
                return false;
            }
            else if (inputField === 'displayVideo' && extension !== ".mp4" && extension !== ".flv") {
                    debugger
                    return false;
            }
            else {
                debugger
                return true;
            }
        }
        else return false;
    }

    onInputBlur = (inputField: string) => {
        let inputResult = this.FileRegexValidation(inputField);
        if (!inputResult) {
            let sendMsg = '';
            if (inputField === 'displayImg') {
                sendMsg = 'Select Image(.gif,.png,.gpeg,.bmp,.jpg) File';
            }
            else if (inputField === 'displayVideo') {
                sendMsg = 'Select Video(.mp4) File';
            }
            this.setState({errorObj: {...this.state.errorObj, [inputField]: sendMsg} });
            return false;
        }
        else {
            // @ts-ignore
            let inputFieldErrMsg = this.state.errorObj[inputField];
            debugger
            if (inputFieldErrMsg !== '') {
                debugger
                this.setState({errorObj: {...this.state.errorObj, [inputField]: ''} });
            }
            return true;
        }
    }

    video_submit = async (e: MouseEvent<HTMLElement>) => {
        const that = this;
        let imgErr = await this.onInputBlur('displayImg');
        let videoErr = await this.onInputBlur('displayVideo');

        if (imgErr && videoErr) {
            let course_id: string = '';
            const data = new FormData();
            this.state.allCourse.map(function (course,index){
                if(that.props.routeProps.location.state === course.course_Name){
                    course_id = course._id;
                }
                return true;
            });
            const { displayImg, displayVideo } = this.state;
            data.append('course_Id', course_id);
            // @ts-ignore
            data.append('courseImgVideo', displayImg);
            // @ts-ignore
            data.append('courseImgVideo', displayVideo);

            let APIresponse = await addcourseVideo(data);

            if(APIresponse) {
                this.fileInput!.value = "";
                let errorObj = {
                    displayImg: '',
                    displayVideo: ''
                }
                this.setState({Alert:1,
                                    errorObj: errorObj,
                                    displayImg: null,
                                    displayVideo: null});
            }
        }
    }

    async componentDidMount() {
        await getAllCourse((err: object, response: fullCourseData[]) => {
            if (response) {
                this.setState({allCourse: response});
            }
        });
    }

    async componentDidUpdate(prevProps: Readonly<Prop>, prevState: Readonly<State>, snapshot?: any) {
        if (JSON.stringify(prevState.allCourse) !== JSON.stringify(this.state.allCourse)) {
            await getAllCourse((err: object, response: fullCourseData[]) => {
                if (response) {
                    this.setState({allCourse: response});
                }
            });
        }
    }

    render(){
        const { errorObj: {displayImg, displayVideo}} = this.state;
        debugger
        return(
            <div>
                <Header routeProps={this.props.routeProps}/>
                <AdminavBar routeProps={this.props.routeProps} />
                {this.state.Alert === 1 ? (<Alert color="success">course-video added successfully!</Alert>) :
                    null }
                <Form>
                    <FormGroup>
                        <Label for="learn">Recently added Course: </Label>
                        <span>{this.props.routeProps.location.state? this.props.routeProps.location.state : null}</span>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="exampleFile" sm={1}>Image: </Label>
                        <Col sm={10}>
                        <input type="file"
                               name="imgFile"
                               id="exampleFile"
                               className="file"
                               onChange={(event) => this.onChangeHandler(event, 'displayImg')}
                        />
                        <span>{displayImg}</span>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="exampleFile" sm={1}>Video: </Label>
                        <Col sm={5}>
                        <input type="file"
                               name="videoFile"
                               className="file"
                               ref={ref => this.fileInput = ref}
                               onChange={(event) => this.onChangeHandler(event, 'displayVideo')}
                        />
                            <span>{displayVideo}</span>
                        </Col>

                    </FormGroup>
                    <FormGroup row>
                        <Label sm={1}></Label>
                        <Col sm={6}>
                            <Button onClick={(event) => {this.video_submit(event)}}>Submit</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}

export default AddcourseVideo;