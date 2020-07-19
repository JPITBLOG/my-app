import React,{Component} from 'react';
import {RouteComponentProps} from "react-router-dom";
import {connect} from 'react-redux';
import {ThunkDispatch} from "redux-thunk";
import {bindActionCreators, Action} from 'redux';

import Cards from '../courses/Cards';
import {AppState} from "../../store";
import {addSelectedTopic} from "../../action/topic";
import {categories} from "../../interfaces/category";
import {fullCourseData} from "../../interfaces/CourseInDetailComponent";
import '../courses/Display.css';
import {getAllCategory} from "../../action/categories";
import {getAllCourse} from "../../action/courses";

interface State {
    currentCard: number,
    position: number,
    cardStyle: {
        transform: string
    },
    width: number,
    cardLimit: number,
    nextClickCount: number,
    topic: any,
    allCategories: categories[],
    allCourse: fullCourseData[],
    didMountAction: number
}

interface dispatchProps {
    SelectTopic: (data: string[]) => void;
}

interface generalProp {
    routeProps: RouteComponentProps
}

type Props = generalProp & dispatchProps;

class Display extends Component<Props, State> {
    private CardData: fullCourseData[] = [];
    private CardDataLength: number = 0;
    private topic  = this.props.routeProps.location.state;
    constructor(props: Props) {
        super(props);
        this.state = {
            currentCard: 0,
            position: 0,
            cardStyle: {
                transform: 'translateX(0px)'
            },
            width: 0,
            cardLimit:0,
            nextClickCount: 5,
            topic:'',
            allCategories: [],
            allCourse: [],
            didMountAction: 0
        };
    }

    addInArray = async() => {
        let AllTopic: any[]  = [];
        let tempArray: any[] = [];
        let selectedTopic: string[] = [];
        const that = this;

        this.state.allCategories.map(function (category,index) {
            tempArray = [];
            // @ts-ignore
            category.subcategory.map(function (subcategory,index) {
                // @ts-ignore
                if(subcategory.subcategory !== [] && subcategory.subcategory.length > 0){
                    // @ts-ignore
                    subcategory.subcategory.map(function (subTopic,index){
                        tempArray.push(subTopic.name);
                        return true;
                    });
                }
                return true;
            });
            // @ts-ignore
            category.subcategory.map(function (subcategory,index) {

                if(subcategory.name === that.props.routeProps.location.state){
                    AllTopic = tempArray.slice(0);
                    if(AllTopic.length <= 0){
                        localStorage.removeItem("selectedTopic");
                    }
                }
                else {
                    if(subcategory?.subcategory !== [] && subcategory?.subcategory?.length){
                        tempArray = subcategory.subcategory ? subcategory.subcategory: [];
                        subcategory?.subcategory?.map(function (subTopic,index){
                            if(that.props.routeProps.location.state === subTopic.name){
                                AllTopic = [];
                                // @ts-ignore
                                if(that.props.routeProps.location.state!.slice(0,3) === 'All'){
                                    AllTopic = tempArray.slice(0);
                                }
                                else {
                                    AllTopic.push(subTopic.name);
                                }
                            }
                            return true;
                        })
                    }
                }
                return true;
            })
            return true;
        });
        that.CardData = [];
        let CardIndex = 0;
        AllTopic.map(function (topic,index) {
            if(typeof topic === "object") {
                selectedTopic.push(topic.name)
                localStorage.setItem("selectedTopic", JSON.stringify(selectedTopic))
                that.state.allCourse.map(function (course: fullCourseData, index) {
                    if (topic.name === course.category_Name) {
                        that.CardData[CardIndex] = course;
                        CardIndex = CardIndex + 1;
                    }
                    return true;
                });
            }
            else{
                selectedTopic.push(topic)
                localStorage.setItem("selectedTopic", JSON.stringify(selectedTopic))
                that.state.allCourse.map(function (course, index) {
                    if (topic === course.category_Name) {
                        that.CardData[CardIndex] = course;
                        CardIndex = CardIndex + 1;
                    }
                    return true;
                });

            }
            return true;
        });
        this.props.SelectTopic(selectedTopic);
        if(this.props.routeProps.location.state !== this.state.topic){
            let nextClickCount = this.CardData.length - 5;
            this.setState({
                topic:this.props.routeProps.location.state,
                nextClickCount:nextClickCount
            });
        }
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
    };

    componentDidMount() {

        getAllCategory((err: object, response: categories[]) => {
            if (response) {
                this.setState({allCategories: response, didMountAction: 1});
                this.addInArray();
            }
        });

        getAllCourse((err: object, response: fullCourseData[]) => {
            if (response) {
                this.setState({allCourse: response});
            }
        });

    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any){
        if (JSON.stringify(prevState.allCategories) !== JSON.stringify(this.state.allCategories)) {
            getAllCategory((err: object, response: categories[]) => {
                if (response) {
                    this.setState({allCategories: response});
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
                cardLimit:5
            });
        }
    }

    handleClick(type: string) {
        // @ts-ignore
        let margin = window.getComputedStyle(document.getElementById("course-card")).marginRight;
        margin = JSON.parse(margin.replace(/px/i, ''));

        const cardLimit = 5;
        // @ts-ignore
        const cardWidth = document.getElementById("course-card").clientWidth; // the card's width
        const cardMargin = margin; // the card's margin

        const cardNumber = this.CardData.length; // the number of cards
        let currentCard = this.state.currentCard; // the index of the current card
        let position = this.state.position; // the position of the cards

        if(cardLimit <cardNumber) {
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
        let cardData = this.CardData;
        return (
            this.CardData && this.CardData.length > 0 ?
                (
                    <div className="cards-slider">
                        <div className="slider-btns">
                            <button className="slider-btn btn-l" onClick={() => this.handleClick('prev')}>&lt;</button>
                            <button className="slider-btn btn-r" onClick={() => this.handleClick('next')}>&gt;</button>
                        </div>
                        <Cards key={"cardContent"}
                               cardStyle={this.state.cardStyle}
                               cardData = {cardData}
                               courses = {this.state.allCourse}
                               categorydetail = {this.state.allCategories}
                               routeProps = {this.props.routeProps}
                        />
                    </div>
                )
                :
                <h3>Data is not available</h3>
        );
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, undefined, Action>) => {
    return {
        SelectTopic : bindActionCreators(addSelectedTopic,dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Display);
