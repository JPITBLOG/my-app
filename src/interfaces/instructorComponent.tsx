import {instructors} from "./instructor";

interface generalPropsForInstructor {

}

export interface State {
    currentCard: number,
    position: number,
    nextClickCount: number,
    cardStyle: {
        transform: string
    },
    width: number,
    instructor: instructors[]
}

export type Prop = generalPropsForInstructor;

interface generalPropsForCard {
    allInstructor: instructors[],
    cardStyle: {
        transform: string
    },
}

export type CardProps = generalPropsForCard;