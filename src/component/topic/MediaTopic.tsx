import React,{Component, MouseEvent} from 'react';
import {connect} from 'react-redux';
import {Media} from 'reactstrap';
import './MediaTopic.css';

import {Prop, State} from "../../interfaces/mediaComponent";
import {AppState} from "../../store";
import {getAllCourse} from "../../action/courses";
import {categories} from "../../interfaces/category";
import {fullCourseData} from "../../interfaces/CourseInDetailComponent";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRupeeSign} from "@fortawesome/free-solid-svg-icons";

class MediaTopic extends Component<Prop, State> {
    private topic = this.props.routeProps.location.state;
    constructor(props: Prop) {
        super(props);
        this.state = {
            sortedBy : "sort",
            topic : [],
            allCourse: []
        }
    }

    setsortedState = (event: React.FormEvent<HTMLSelectElement>) => {
        let setvalue = event.currentTarget.value;
        this.setState({
            sortedBy:setvalue
        });
    }

    onCourseClick(event: MouseEvent<HTMLElement>,fullCourse: fullCourseData){
        this.props.routeProps.history.push({pathname:'/course-detail/',state:fullCourse,search:"?id="+fullCourse._id});
    }

    componentWillReceiveProps = () => {
        const that = this;
        let selectedTopicReceive: string[] = [];
        selectedTopicReceive =  this.props.selectedTopic.AllSelectedTopic;
        if(this.state.topic.length > 0 && this.state.topic[0] !== selectedTopicReceive[0]){
            that.setState({topic : selectedTopicReceive,sortedBy : "sort"});
        }
    }

    myfun = () => {
        const that = this;
        let topicData = [];
        let filtredData = [];
        let coursesFiltered: fullCourseData[] = [];
        let selectedTopic: string[] = [];
        let topics;
        topics = JSON.parse(localStorage.getItem("topic") || '[]');
        debugger
        let AllTopic = topics.filter(function (singleTopic: string) {
            debugger
            return singleTopic.slice(0,3).toLowerCase() === "all"
        });
        debugger
        if(topics !== null && AllTopic.length < 1 && topics.length>0) {
            debugger
            topics.map(function (topic: string) {
                let filtredmarge;
                filtredmarge = that.state.allCourse.filter(courses => {
                    if(courses.category_Name === topic){
                        let price = parseInt(courses.price);
                        let offer = parseInt(courses.offer);
                        let discount = parseInt(String(price - ((price * offer) / 100)));
                        if(that.state.sortedBy === "lowestPrice"){
                            if(discount<500){
                                return courses;
                            }
                        }
                        else if(that.state.sortedBy === "highestPrice"){
                            if(discount>500){
                                return courses;
                            }
                        }
                        else {
                            return courses;
                        }
                    }
                });
                filtredmarge.map(function (filtredelement){
                    coursesFiltered.push(filtredelement);
                    return true;
                });
                return true;
            });
        }
        else {
            topicData = [];
            debugger
            topicData = this.props.selectedTopic.AllSelectedTopic;
            if(topicData !== null && topicData.length > 0 ) {
                selectedTopic =  this.props.selectedTopic.AllSelectedTopic;
                if(this.state.topic.length === 0){
                    this.setState({topic : selectedTopic,sortedBy : "sort"});
                }
            }
            if(selectedTopic.length > 0){
                selectedTopic.map(function (stopic,index){
                    that.state.allCourse.map(courses => {
                        if(courses.category_Name === stopic){
                            let price = parseInt(courses.price);
                            let offer = parseInt(courses.offer);
                            let discount = parseInt(String(price - ((price * offer) / 100)));
                            if(that.state.sortedBy === "lowestPrice"){
                                if(discount<500){
                                    coursesFiltered.push(courses);
                                }
                            }
                            else if(that.state.sortedBy === "highestPrice"){
                                if(discount>500){
                                    coursesFiltered.push(courses);
                                }
                            }
                            else if(that.state.sortedBy === "sort"){

                                coursesFiltered.push(courses);
                            }
                        }
                        return true;
                    });
                    return true;
                });
            }
        }

        filtredData = coursesFiltered.map(function (course,index){
            let price = parseInt(String(course.price));
            let offer = parseInt(String(course.offer));
            let discount = parseInt(String(price - ((price * offer) / 100)));
            // @ts-ignore
            // @ts-ignore
            return (<Media className="main-wrap" onClick={(event) => that.onCourseClick(event,course)}
                           key = {index}>
                <Media left>
                    <Media object src={course.course_Img} height = "200px" width = "200px"/>
                </Media>
                <Media body>
                    <Media heading>
                        <div className='course-wrap'>
                            <div>
                                {course.course_Name}
                            </div>
                            <div className='price-list'>
                                <p><FontAwesomeIcon icon={faRupeeSign} />{discount}</p>
                                <p style={{ textDecorationLine: 'line-through' }}><FontAwesomeIcon icon={faRupeeSign} />{course.price}</p>
                            </div>
                        </div>
                    </Media>
                    {course.course_Subtitle}
                    <div>
                    </div>
                    <div>
                    </div>
                </Media>
            </Media>)
        });
        return filtredData;
    }

    componentDidMount() {
        getAllCourse((err: object, response: categories[]) => {
            if (response) {
                this.setState({allCourse: response});
            }
        });
    }

    componentDidUpdate(prevProps: Readonly<Prop>, prevState: Readonly<State>, snapshot?: any) {
        if (JSON.stringify(prevState.allCourse) !== JSON.stringify(this.state.allCourse)) {
            getAllCourse((err: object, response: categories[]) => {
                if (response) {
                    this.setState({allCourse: response});
                }
            });
        }
    }

    render(){
        return(
            <div>
                <table>
                    <tbody>
                    <tr className="hide_all">
                        <td>
                            <select id="selected" value={this.state.sortedBy}  onChange = {(event) => this.setsortedState(event)}>
                                <option value="sort">Sort</option>
                                <option value="lowestPrice">Lowest Price</option>
                                <option value="highestPrice">Highest Price</option>
                            </select>
                        </td>
                        <td>Courses</td>
                    </tr>
                    </tbody>
                </table>
                {this.myfun()}
            </div>
        )
    }

}

const mapStateToProps = (state: AppState) => {
    const {topic, filter}  = state;
    return {
        selectedTopic: topic,
        filterTopic: filter
    }
};

export default connect(mapStateToProps)(MediaTopic);
