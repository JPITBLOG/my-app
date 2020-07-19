interface topicInterface {
    AllSelectedTopic: string[],
    error_msg: object
}

interface errorInSelectTopic {
    error_msg: string
}

interface topicActionData {
    type: string,
    data: string[] | errorInSelectTopic
}

type actionType = topicActionData

const INITIAL_STATE : topicInterface = {
    AllSelectedTopic: [],
    error_msg: {}
};

export const SELECTED_TOPIC_SET_SUCCESSFUL = "SELECTED_TOPIC_SET_SUCCESSFUL";
export const ERROR_IN_SELECT_TOPIC = "ERROR_IN_SELECT_TOPIC";

export default (state = INITIAL_STATE,action : actionType) => {
    switch (action.type){
        case SELECTED_TOPIC_SET_SUCCESSFUL:{
            return Object.assign({},state,{...state,AllSelectedTopic:action.data});
        }
        case ERROR_IN_SELECT_TOPIC:{
            return Object.assign({},state,{error_msg:action.data});
        }
        default:
            return state;
    }
}
