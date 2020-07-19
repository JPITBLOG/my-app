import React,{Component} from 'react';
import {RouteComponentProps} from "react-router-dom";
import {connect} from "react-redux";
import {bindActionCreators, Action} from "redux";
import {ThunkDispatch} from "redux-thunk";

import {AppState} from "../../store";

import {getAllCategory} from "../../action/categories";
import {getAllCourse} from "../../action/courses";
import {addSelectedTopic} from "../../action/topic";
import {categories} from "../../interfaces/category";

import Cards from "./Cards";

import './Display.css';
import {fullCourseData} from "../../interfaces/CourseInDetailComponent";

interface State {
    currentCard: number,
    position: number,
    cardStyle: {
        transform: string
    },
    width: number,
    nextClickCount: number,
    cardLimit: number,
    topic: any,
    allCategories: categories[],
    allCourse: fullCourseData[],
    didMountAction: number
}

interface dispatchProps {
    addSelectTopic: (data: string[]) => void;
}

interface generalProp {
    routeProps: RouteComponentProps,
    topic?: any
}

type Props = generalProp & dispatchProps;

class Display extends Component<Props, State> {
    private CardData: fullCourseData[] | [] = [];
    private topic = this.props.routeProps.location.state;
    constructor(props: Props) {
        super(props);
        this.state = {
            currentCard: 0,
            position: 0,
            cardStyle: {
                transform: 'translateX(0px)'
            },
            width: 0,
            nextClickCount: 0,
            cardLimit: 0,
            topic: '',
            allCategories: [],
            allCourse: [],
            didMountAction: 0
        };
    }

    addInArray = () => {
        let CardIndex = 0;
        let AllTopic: string[] = [];
        let AllTopicIndex = 0;
        const that = this;

        if(this.props.routeProps.location.state !== this.state.topic){
            this.setState({
                topic:this.props.routeProps.location.state
            });
        }
        let topic = this.props.routeProps.location.state
        try{
            this.state.allCategories.map(function (category,index) {
                if(category.name === topic) {
                    category.subcategory!.map(function (subcategory, index) {
                        if (subcategory.subcategory !== [] && subcategory.subcategory!.length) {
                            subcategory.subcategory!.map(function (subTopic, index) {
                                AllTopic[AllTopicIndex] = subTopic.name;
                                AllTopicIndex++;
                                return true;
                            })
                        }
                        return true;
                    });
                }
                else {
                    category.subcategory!.map(function (subcategory,index) {
                        if(topic === subcategory.name){
                            subcategory?.subcategory?.map(function (subTopic,index) {
                                AllTopic[AllTopicIndex] = subTopic.name;
                                AllTopicIndex++;
                                return true;
                            });
                        }
                        return true;
                    });
                }
                return true;
            });

            this.state.allCourse.map(function (course,index) {
                AllTopic.map(function (topic,index) {
                    if(topic === course.category_Name) {
                        that.CardData[CardIndex] = course;
                        CardIndex = CardIndex+1;
                    }
                    return true;
                });
                return true;
            });
            if (this.state.didMountAction && this.CardData.length) {
                let boxWidth;
                try {
                    boxWidth = 220;
                }
                catch (e) {
                    boxWidth = 0;
                }
                let nextClickCount = this.CardData.length - 5;
                this.setState({ width: boxWidth ,currentCard: 0,
                    position: 0,cardLimit: 5, nextClickCount: nextClickCount, didMountAction: 0});
            }
        }
        catch (e) {
            console.log("there is an error :",e);
        }
    };

    async componentDidMount() {
        await getAllCategory((err: object, response: categories[]) => {
            if (response) {
                this.setState({allCategories: response, didMountAction: 1});
                this.addInArray();
            }
        });

        await getAllCourse((err: object, response: fullCourseData[]) => {
            if (response) {
                this.setState({allCourse: response});
            }
        });
    }

    async componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {

        if (JSON.stringify(prevState.allCategories) !== JSON.stringify(this.state.allCategories)) {
            await getAllCategory((err: object, response: categories[]) => {
                if (response) {
                    this.setState({allCategories: response});
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

        if(this.props.routeProps.location.state !== this.state.topic) {
            let boxWidth;
            try {
                // @ts-ignore
                boxWidth = document.getElementById("course-card").clientWidth;
            }
            catch (e) {
                boxWidth = 0;
            }
            this.CardData = [];
            this.addInArray();
            this.setState({
                width: boxWidth,
                currentCard: 0,
                position: 0,
                cardStyle: {
                    transform: 'translateX(0px)'
                },
                nextClickCount:this.CardData ? this.CardData.length - 5 : 0,
                cardLimit: 5
            });
        }

    }


    handleClick(type: string) {
        // @ts-ignore
        let margin = window.getComputedStyle(document.getElementById("course-card")).marginRight;
        margin = JSON.parse(margin.replace(/px/i, ''));

        const cardLimit = 5;
        const cardWidth = this.state.width; // the card's width
        const cardMargin = margin; // the card's margin
        const cardNumber = this.CardData.length; // the number of cards
        let currentCard = this.state.currentCard; // the index of the current card
        let position = this.state.position; // the position of the cards
        if(cardLimit <cardNumber){
            if(type === 'next' && currentCard < cardNumber-1 && this.state.nextClickCount >0) {
                currentCard++;
                this.setState({nextClickCount:this.state.nextClickCount-1});
                position -= (cardWidth+cardMargin);
            } else if(type === 'prev' && currentCard > 0) {
                currentCard--;
                this.setState({nextClickCount:this.state.nextClickCount+1});
                position += (cardWidth+cardMargin);
            }
        }
        this.setCard(currentCard, position);
    }

    setCard(currentCard: number, position: number) {
        this.setState({
            currentCard: currentCard,
            position: position,
            cardStyle: {
                transform: `translateX(${position}px)`
            }
        });
    }

    render() {
        if (this.state.allCategories.length) {
            this.addInArray();
        }
        const cardData = this.CardData;
        return (
            this.CardData && this.CardData.length > 0 ?
                (
                    <div key={"cardDataDivKey"} className="cards-slider">
                        <div className="slider-btns">
                            <button className="slider-btn btn-l" onClick={() => this.handleClick('prev')}>&lt;</button>
                            <button className="slider-btn btn-r" onClick={() => this.handleClick('next')}>&gt;</button>
                        </div>
                        <Cards routeProps = {this.props.routeProps} key={"coursesSliders"} cardStyle={this.state.cardStyle} cardData = {cardData} courses = {this.state.allCourse} categorydetail = {this.state.allCategories}/>
                    </div>
                )
                :<h3>Data is not available</h3>
        );
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, undefined, Action>) => {
    return {
        addSelectTopic: bindActionCreators(addSelectedTopic, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Display);
