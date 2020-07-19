import React,{Component} from 'react';
import {getAllInstructor} from "../../action/instructor";
import {instructors} from "../../interfaces/instructor";
import {CardProps, Prop, State} from "../../interfaces/instructorComponent";
import './instructor.css';

class Cards extends Component<CardProps> {
    private CardData: instructors[] = [];

    addInArray = () => {
        let instructorArray: any = [];

        this.CardData = this.props.allInstructor;
        this.CardData.map((card,index) => {
            instructorArray.push(<>
                <div className="InstructorCard mt-3 mb-3" id="card" style={this.props.cardStyle} key={card._id}>

                    <div>
                        <div className="card-wrap">
                            <img className="cardimg" src={card.own_Img} alt="Avatar"/>
                            <p className="name" key={"p"+index}><b>{card.name}</b></p>
                            <div className="profession wrep" key={"profession"+index}><b>Profession: </b>{card.profession}</div>
                            <p className="courses"><b>{"Number of Course: "}</b>{card.courses}</p>
                        </div>
                    </div>
                </div>
            </>)
            return true;
        });
        return instructorArray;
    };

    render() {
        return (
            <section key={"section"}>
                {
                    this.addInArray()
                }
            </section>
        )
    }
}

class InstructorSlider extends Component<Prop, State> {
    private CardData: instructors[] | undefined = [];
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
            instructor: []
        };
    }

    // func: click the slider buttons
    handleClick(type: String) {
        //const cardLimit = 5;
        // get the card's margin-right
        // @ts-ignore
        let margin = window.getComputedStyle(document.getElementById("card")).marginRight;
        margin = JSON.parse(margin.replace(/px/i, ''));

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

    addInstructor = () => {
        let allInstructor = [];
        allInstructor = this.state.instructor.slice(0);
        return allInstructor;
    }

    async componentDidMount() {
        await getAllInstructor((err: object, response: instructors[]) => {
            if (response) {
                this.CardDataLength = response.length;
                this.setState({instructor: response});
            }
        });

        let boxWidth;
        try {
            boxWidth = 220;
        }
        catch (e) {
            boxWidth = 0;
        }
        this.setState({ width: boxWidth });
        let nextClickCount = this.CardDataLength - 5;
        this.setState({
            nextClickCount:nextClickCount
        });
    }

    async componentDidUpdate(prevProps: Readonly<Prop>, prevState: Readonly<State>, snapshot?: any) {
        if (JSON.stringify(prevState.instructor) !== JSON.stringify(this.state.instructor)) {
            await getAllInstructor((err: object, response: instructors[]) => {
                if (response) {
                    this.CardDataLength = response.length;
                    this.setState({instructor: response});
                }
            });

            let boxWidth;
            try {
                boxWidth = 220;
            }
            catch (e) {
                boxWidth = 0;
            }
            this.setState({ width: boxWidth });
            let nextClickCount = this.CardDataLength - 5;
            this.setState({
                nextClickCount:nextClickCount
            });
        }
    }

    render() {
        this.CardData = this.addInstructor();
        this.CardDataLength = this.state.instructor.length;
        return (
            this.CardData ?
                (
                    <div className="InstructorCard-slider" key={"instructor-card-slider"}>
                        <div className="slider-btns">
                            <button className="slider-btn btn-l" onClick={() => this.handleClick('prev')}>&lt;</button>
                            <button className="slider-btn btn-r" onClick={() => this.handleClick('next')}>&gt;</button>
                        </div>
                        <Cards cardStyle={this.state.cardStyle} allInstructor={this.CardData}/>
                    </div>
                ) : null
        );
    }
}

export default InstructorSlider;