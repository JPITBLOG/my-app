import {categories} from "./category";

interface generalPropsForPtopic {

}

export interface State {
    currentCard: number,
    position: number,
    nextClickCount: number,
    cardStyle: {
        transform: string
    },
    width: number,
    allCategories: categories[]
}

export type Prop = generalPropsForPtopic;

interface generalPropsForCard {
    allTopic: string[] | undefined,
    cardStyle: {
        transform: string
    },
}

export type CardProps = generalPropsForCard;