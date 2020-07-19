import {ThunkAction} from "redux-thunk";
import {Action} from "redux";
import {AppState} from "../store";
import {SELECTED_TOPIC_SET_SUCCESSFUL,ERROR_IN_SELECT_TOPIC} from '../reducer/topic';

export const addSelectedTopic = (Topic: string[]): ThunkAction<void, AppState, {}, Action> =>{
    return (dispatch) => {
        try {
            dispatch({
                type:SELECTED_TOPIC_SET_SUCCESSFUL,
                data:Topic
            })
        }
        catch (e) {
            dispatch({
                type:ERROR_IN_SELECT_TOPIC,
                data:{error_msg:e.toString()}
            })
        }
    }
};
