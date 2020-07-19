import {getAllCourses, addcourse, addcourseVideoData} from '../services/course';

export const getAllCourse = (callback: any) => {
    getAllCourses()
        .then((response) => {
            if (response.status === 200) {
                callback(null, response.data);
            }
        })
        .catch((Err) => {
            callback(Err);
        });
}

export const addcourseData = (passDataObject: any) => {
    return addcourse(passDataObject)
        .then((response) => {
            if (response.status === 200) {
                return true;
            }
        }).catch((error) => {
            return false;
        });
    }


export const addcourseVideo = (passvideoObject: any) => {
    return addcourseVideoData(passvideoObject)
        .then((response) => {
            if(response.status === 200){
                return true;
            }
        }).catch((error)=> {
        if(error.response){
            return false;
        }
    });
}