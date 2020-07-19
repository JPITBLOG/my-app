import './popularTopic.css';
import React,{Component} from 'react';
import {Button} from 'reactstrap';
import {getAllCategory} from "../../action/categories";
import {categories} from "../../interfaces/category";
import {Prop, State, CardProps} from "../../interfaces/PopularTopicComponent";

class Cards extends Component<CardProps> {
    private CardData: string[] = [];

    addInArray = () => {
        let topicArray = [];
        const that = this;
        // @ts-ignore
        this.CardData = [...this.props.allTopic];
        for (let i=0;i<this.CardData.length;i=i+2){
            topicArray.push(
                <div className="TopicCard shadow-none" id="card" style={that.props.cardStyle} key={i}>
                    {/*<a href="#"><img src={card.course_Img} /></a>*/}
                    <p key = {"p"+i}><Button key = {"button"+i} className='btn-custom bg-transparent'>{this.CardData[i]}</Button></p>
                    {(i+1)< this.CardData.length ? (<p key = {"p2"+i}><Button key = {"button2"+i} className='bg-transparent'>{this.CardData[i+1]}</Button></p>) : null}</div>
            )
        }
        return topicArray;
    };

    render() {
        return (
            <section>
                <div><b>Popular Topic</b></div>
                {
                    this.addInArray()
                }
            </section>
        )
    }
}

class Ptopic extends Component<Prop, State> {
    private CardData: string[] | undefined = [];
    private CardDataLength: number = 0;
    constructor(props: Prop) {
        super(props);
        this.state = {
            currentCard: 0,
            position: 0,
            nextClickCount: 0,
            cardStyle: {
                transform: 'translateX(0px)'
            },
            width: 0,
            allCategories: []
        };
    }

    componentDidMount() {
        try{
            // @ts-ignore
            let boxWidth = document.getElementById("card").clientWidth;
            this.setState({ width: boxWidth });
            let nextClickCount = this.CardDataLength - 5;
            this.setState({
                nextClickCount:nextClickCount
            });
        }
        catch (e) {
            console.log("there is an error: ",e);
        }
        getAllCategory((err: object, response: categories[]) => {
            if (response) {
                this.setState({allCategories: response});
            }
        });
    }

    componentDidUpdate(prevProps: Readonly<Prop>, prevState: Readonly<State>, snapshot?: any) {
        if (JSON.stringify(prevState.allCategories) !== JSON.stringify(this.state.allCategories)) {
            getAllCategory((err: object, response: categories[]) => {
                if (response) {
                    this.setState({allCategories: response});
                }
            });
        }
    }

    // func: click the slider buttons
    handleClick(type: string) {
        // get the card's margin-right
        // @ts-ignore
        let marginInPx : string = window.getComputedStyle(document.getElementById("card")).marginRight;
        let margin = JSON.parse(marginInPx.replace(/px/i, ''));

        const cardWidth = this.state.width; // the card's width
        const cardMargin = margin; // the card's margin
        const cardNumber = this.CardDataLength; // the number of cards
        let currentCard = this.state.currentCard; // the index of the current card
        let position = this.state.position; // the position of the cards

        // slide cards
        if(type === 'next' && currentCard < cardNumber-1 && this.state.nextClickCount >0) {
            currentCard++;
            this.setState({nextClickCount:this.state.nextClickCount-1});
            position -= (cardWidth+cardMargin);
        } else if(type === 'prev' && currentCard > 0) {
            currentCard--;
            this.setState({nextClickCount:this.state.nextClickCount+1});
            position += (cardWidth+cardMargin);
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

    addTopic = () => {
        let allTopic: string[] = [];
        try{
            this.state.allCategories.map(function (category,index) {
                if (category.subcategory !== undefined && category.subcategory.length > 0) {
                    category.subcategory.map(function (category,index) {
                        if(category.subcategory !== undefined && category.subcategory.length > 0){
                            category.subcategory.map(function (subctgryname,index) {
                                allTopic.push(subctgryname.name);
                                return 0;
                            })

                        }
                        return 0;
                    });
                }
                return 0;
            });
            return allTopic;
        }
        catch (e) {
            console.log("there is an error: ",e);
        }
    }

    render() {
        this.CardData = this.addTopic();
        try {
            this.CardDataLength = this.CardData ? Math.round(this.CardData.length/2) : 0;
        }
        catch (e) {
            console.log("there is an error: ",e);
        }
        let topic: string[] | undefined = [];
        topic = this.addTopic();
        return (
            this.CardData ?
                (
                    <div className="TopicCards-slider shadow-none slide-container">
                        <div className="slider-btns">
                            <button className="slider-btn btn-l" onClick={() => this.handleClick('prev')}>&lt;</button>
                            <button className="slider-btn btn-r" onClick={() => this.handleClick('next')}>&gt;</button>
                        </div>

                        <Cards cardStyle={this.state.cardStyle} allTopic={topic}/>
                    </div>
                ) : null
        );
    }
}

export default Ptopic;
