import React, {Component} from 'react';
import {RouteComponentProps} from "react-router-dom";
import { Tabs, Tab } from 'react-bootstrap';
import {Input} from 'reactstrap';

import {getAllInstructor} from "../../action/instructor";

import {getAllCategory} from "../../action/categories";
import {categories} from "../../interfaces/category";
import {getAllCourse} from "../../action/courses";
import {instructors} from "../../interfaces/instructor";
import {fullCourseData} from "../../interfaces/CourseInDetailComponent";
import Courses from "./courses";

interface Prop {
    routeProps: RouteComponentProps
}

interface State {
    key: string,
    allInstructors: instructors[] | [],
    instructor: string | null,
    allCourse: fullCourseData[] | [],
    categoryData: categories[]
}

class TabSlider extends Component<Prop, State> {
    private instructorArray: any[] | null = [];
    constructor(props: Prop) {
        super(props);
        this.state = {
            key: '',
            allInstructors : [],
            instructor: '',
            allCourse: [],
            categoryData: []
        };

        this.handleSelect = this.handleSelect.bind(this);
        this.getAllInstructor = this.getAllInstructor.bind(this);
        this.instructorSelect = this.instructorSelect.bind(this);
    }
    handleSelect(key: string) {
        if(key !== this.state.key){
            this.setState({key});
        }
    }

    getAllcategoryData(){
        let categoryFilter: string[] = [];
        let Allfilteredtopic = [];
        let categoryTab: any[] = [];
        const that = this;
        try {
            this.state.categoryData.map(function (category, index) {
                let subcategoryFilter = category.subcategory?.filter((subcategory) => {
                    return subcategory.subcategory!.length > 0;
                })
                if (subcategoryFilter!.length > 0) {
                    categoryFilter.push(category.name);
                    let ctgryTopic: string[] = [];
                    subcategoryFilter!.map(function (subtopic, index) {
                        subtopic.subcategory?.map(function (topic, index) {
                            ctgryTopic.push(topic.name);
                        })
                        return true;
                    });
                    Allfilteredtopic.push(ctgryTopic);
                }
                return true;
            });

            if(that.state.key === '' || that.state.key === undefined){
                that.setState({key:categoryFilter[0]})
            }

            categoryFilter.map(function (category, index) {
                categoryTab.push(<Tab key={category} eventKey={category} title={category}>{category}</Tab>);
                return true;
            });

            return categoryTab;
        }
        catch (e) {
            console.log("there is an error while fetching subcategory data: ",e);
        }
    }

    instructorSelect = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        if(e.currentTarget.value === 'Select Instructor')
            this.setState({instructor:''})
        else
            this.setState({instructor:e.currentTarget.value});
    }

    getAllInstructor = () => {
        const that = this;
        if (this.state.allInstructors.length) {
            // @ts-ignore
            this.state.allInstructors.map(function (instructor: instructors, index: number) {
                that.instructorArray!.push(<option>
                    {instructor.name}</option>);
                return true;
            });
            return this.instructorArray;
        }
    }

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

        await getAllInstructor((err: object, response: instructors[] | []) => {
            if (response) {
                this.setState({allInstructors: response});
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
        if (JSON.stringify(prevState.allInstructors) !== JSON.stringify(this.state.allInstructors)) {
            await getAllInstructor((err: object, response: instructors[] | []) => {
                if (response) {
                    this.setState({allInstructors: response});
                }
            });
        }
    }

    render () {
        // @ts-ignore
        // @ts-ignore
        return(
            <div>
                {this.state.instructor === '' ? (
                    <Tabs onSelect={this.handleSelect}
                          id="controlled-tab-example">
                        {this.getAllcategoryData()}
                    </Tabs>
                ) : null}

                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-md-8'>
                        <Courses topic={this.state.key}
                                 instructor={this.state.instructor}
                                 routeProps = {this.props.routeProps}/>
                        </div>
                        <div className='col-md-4 instructor'>
                            <Input type="select" name="instructorSelect" id="instructorSelect" onChange={(event) => this.instructorSelect(event)}>
                                <option value=''>Select Instructor</option>
                            {   this.getAllInstructor()}
                            </Input>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default TabSlider;