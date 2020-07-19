import React, {Component} from 'react';

import {connect} from 'react-redux';
import {bindActionCreators, Action} from 'redux';
import {ThunkDispatch} from "redux-thunk";

import './Filter.css';
import {AppState} from "../../store";
import {Button, Collapse, FormGroup} from "reactstrap";

import {Prop, State} from "../../interfaces/FilterComponent";
import {addfilteredTopic, removefilteredTopic} from "../../action/Filter";
import {getAllCategory} from "../../action/categories";
import {categories} from "../../interfaces/category";
import {getAllCourse} from "../../action/courses";

class Filter extends Component<Prop, State> {
    constructor(props: Prop) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.OnChangeCheckbox = this.OnChangeCheckbox.bind(this);
        this.state = {
            collapse: false,
            matchedArray : [],
            allCategories: [],
            allCourse: [],
            defaultCheckedTopic: false,
            topic: '',
            checkedValue: {

            }
        };
    }

    toggle() {
        this.setState(state => ({collapse: !state.collapse}));
    }

    OnChangeCheckbox = async (event: React.MouseEvent<HTMLInputElement>) => {
        if(event.currentTarget.checked) {
            let checkedValue = {...this.state.checkedValue};
            checkedValue[event.currentTarget.value] = true;
            this.setState({checkedValue: checkedValue});
            await this.props.addfilteredTopic(event.currentTarget.name,event.currentTarget.value);
        }
        else {
            let checkedValue = {...this.state.checkedValue};
            checkedValue[event.currentTarget.value] = false;
            this.setState({checkedValue: checkedValue});
            await this.props.removefilteredTopic(event.currentTarget.name,event.currentTarget.value);
        }
    };

    getChecked = (courseType: string,courseName: string) => {
        if(localStorage.getItem(courseType) !== null) {
            if (JSON.parse(localStorage.getItem(courseType) || '').includes(courseName)) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    async componentDidMount() {
        await getAllCategory((err: object, response: categories[]) => {
            if (response) {
                this.setState({allCategories: response});
            }
        });
        await getAllCourse((err: object, response: categories[]) => {
            if (response) {
                this.setState({allCourse: response});
            }
        });
        if (this.state.topic !== this.props.topic) {
            this.setState({topic: this.props.topic, checkedValue: {}});
        }
    }

    async componentDidUpdate(prevProps: Readonly<Prop>, prevState: Readonly<State>, snapshot?: any) {
        if (JSON.stringify(prevState.allCategories) !== JSON.stringify(this.state.allCategories)) {
            await getAllCategory((err: object, response: categories[]) => {
                if (response) {
                    this.setState({allCategories: response});
                }
            });
        }
        if (JSON.stringify(prevState.allCourse) !== JSON.stringify(this.state.allCourse)) {
            await getAllCourse((err: object, response: categories[]) => {
                if (response) {
                    this.setState({allCourse: response});
                }
            });
        }

        if (this.state.topic !== this.props.topic) {
            this.setState({topic: this.props.topic, checkedValue: {}});
        }
    }

    render() {
        debugger
        let matchedTopicArray: any[] = [];
        let matchedSubArray: any = [];
        let topic = this.props.topic;
        this.state.allCategories.map(function (categories, index) {
            // @ts-ignore
            categories.subcategory.map(function (subcategories, index) {
                // @ts-ignore
                let matchsubcategoryArray = categories.subcategory.slice(0);
                if(subcategories.name === topic){
                    matchedSubArray = matchsubcategoryArray;
                    matchsubcategoryArray.map(function (subcategory,index) {
                        // @ts-ignore
                        if(subcategory.subcategory.length >0){
                            // @ts-ignore
                            subcategory.subcategory.map(function (subcategories) {
                                matchedTopicArray.push(subcategories);
                                return true;
                            });
                        }
                        return true;
                    });

                }
                else {
                    // @ts-ignore
                    if(subcategories.subcategory.length > 0){
                        // @ts-ignore
                        let matchArray = subcategories.subcategory.slice(0);

                        // @ts-ignore
                        subcategories.subcategory.map(function (categories, index) {
                            if (categories.name === topic) {
                                matchedTopicArray = [];
                                matchedSubArray = [];
                                matchArray.splice(index, 1);
                                matchedTopicArray = matchArray;
                                matchedSubArray = matchsubcategoryArray;
                            }
                            return true;
                        });
                        matchedTopicArray = matchedTopicArray.filter(function (subcategory) {
                            return subcategory.name.slice(0,3) !== "All"
                        });
                    }
                }
                return true;
            });
            return true;
        });
        console.log('matched topic array: ', this.state.checkedValue);
        debugger
        // const uniqueLanguage = [{...new Set(this.state.allCourse.map(course => course.language))}];
        return (
            <div className="ios-add">
                <h2 className="topic--section-heading--UrZPh"> {topic} courses</h2>
                <span className="track-impression--waypoint--wvgq2"><span></span></span>
                <p className="mt-space-xs mb-space-0" data-purpose="secondary-description">Udemy hosts top-rated iOS
                    development instructors who are experts at showing students how to master the art of developing apps
                    for Apple products. Whether you’re interested in developing for the iPhone, iPad, or MacBook, Udemy
                    has a course to help you achieve your goals.</p>
                <div className="filter-btn-wrap mt-3">
                    <Button  onClick={this.toggle}>{this.state.collapse ? "Done" : "Filter"}</Button>
                    <Collapse isOpen={this.state.collapse? true : false}>
                        <FormGroup>
                            <table>
                                <thead>
                                <tr className="hide_all">
                                    <th colSpan={3}></th>
                                </tr>
                                <tr className="hide_all">
                                    <th>Topic</th>
                                </tr>
                                </thead>
                                <tbody>

                                {(() => {
                                    let maxarrayLength = 0;
                                    let newArray = [];
                                    try {
                                        maxarrayLength = Math.max(matchedTopicArray.length, matchedSubArray.length);
                                        for (let i = 0; i < maxarrayLength; i++) {
                                            newArray.push(<tr className="hide_all">
                                                {matchedTopicArray[i] ?
                                                    <td><input type="checkbox" name="topic"
                                                               onClick={this.OnChangeCheckbox}
                                                               checked={this.state.checkedValue[matchedTopicArray[i].name] || this.getChecked('topic', matchedTopicArray[i].name)}
                                                               value={matchedTopicArray[i].name}
                                                        />
                                                               {matchedTopicArray[i].name}
                                                    </td>
                                                    : <td></td>}
                                            </tr>);
                                        }
                                        return newArray;
                                    }
                                    catch (e) {
                                        return (<div>There is no data available</div>);
                                    }
                                })()}
                                </tbody>
                            </table>
                        </FormGroup>
                    </Collapse>
                </div>
            </div>

        );
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, undefined, Action>) => {
    return {
        addfilteredTopic: bindActionCreators(addfilteredTopic, dispatch),
        removefilteredTopic: bindActionCreators(removefilteredTopic, dispatch)
    }
};

export default connect(null,mapDispatchToProps)(Filter);
