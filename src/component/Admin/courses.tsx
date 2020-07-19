import React,{Component} from 'react';
import {RouteComponentProps} from "react-router-dom";
import {getAllCategory} from "../../action/categories";
import {categories} from "../../interfaces/category";
import {getAllCourse} from "../../action/courses";
import {fullCourseData} from "../../interfaces/CourseInDetailComponent";

import CoursesMapped from "./coursesMapped";

interface Prop {
    topic: string,
    instructor: string | null,
    routeProps: RouteComponentProps
}

interface State {
    allCourse: fullCourseData[] | [],
    categoryData: categories[]
}

class Courses extends Component<Prop, State>{
    private CardData: fullCourseData[] = []
    constructor(props: Prop) {
        super(props);
        this.state = {
            allCourse: [],
            categoryData: []
        }
    }

    addInArray = () => {
        let CardIndex = 0;
        let AllTopic: string[] = [];
        let AllTopicIndex = 0;
        const that = this;

        let topic = this.props.topic;
        let instructor = this.props.instructor;
        try{
            if(this.props.instructor === ''){
                this.state.categoryData.map(function (category,index) {
                    if(category.name === topic) {
                        category.subcategory?.map(function (subcategory,index) {
                            if(subcategory.subcategory !== [] && subcategory.subcategory?.length){
                                subcategory.subcategory.map(function (subTopic,index){
                                    AllTopic[AllTopicIndex] = subTopic.name;
                                    AllTopicIndex++;
                                    return true;
                                });
                            }
                        })
                    }
                    return true;
                });

                // @ts-ignore
                this.state.allCourse.map(function (course,index){
                    AllTopic.map(function (topic,index) {
                        if(topic === course.category_Name){
                            that.CardData[CardIndex] = course;
                            CardIndex = CardIndex+1;
                        }
                        return true;
                    })
                    return true;
                });
            }
            else {
                // @ts-ignore
                this.state.allCourse.map(function (course,index){
                    if(course.created_By.includes(instructor)){
                        that.CardData[CardIndex] = course;
                        CardIndex = CardIndex+1;
                    }
                    return true;
                });
            }

        }
        catch (e) {
            console.log("there is an error :",e);
        }
    };

    async componentDidMount() {
        await getAllCategory((err: object, response: categories[]) => {
            if (response) {
                this.setState({categoryData: response});
            }
        });

        await getAllCourse((err: object, response: fullCourseData[]) => {
            if (response) {
                this.setState({allCourse: response});
            }
        });
    }

    async componentDidUpdate(prevProps: Readonly<Prop>, prevState: Readonly<State>, snapshot?: any) {
        if (JSON.stringify(prevState.categoryData) !== JSON.stringify(this.state.categoryData)) {
            await getAllCategory((err: object, response: categories[] | []) => {
                if (response) {
                    this.setState({categoryData: response});
                }
            });
        }
        if (JSON.stringify(prevState.allCourse) !== JSON.stringify(this.state.allCourse)) {
            await getAllCourse((err: object, response: fullCourseData[]) => {
                if (response) {
                    this.setState({allCourse: response});
                }
            });
        }
    }

    render(){

        this.CardData = [];
        this.addInArray();
        return(
            this.CardData.length > 0 ? (
                <div>
                    {this.props.instructor !== '' ? (<div>{'instructor : '+this.props.instructor}</div>) : (<div>{this.props.topic+' courses'}</div>)}

                    <CoursesMapped cardData = {this.CardData} routeProps = {this.props.routeProps}/>
                </div>
            ):(
                <div>There is no any Course inserted by  <b>{this.props.instructor}</b></div>
            )
        );
    }
}

export default Courses;
