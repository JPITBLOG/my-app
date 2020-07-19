import {getAllInstructors} from '../services/instructor';

export const getAllInstructor = (callback: any) => {
    getAllInstructors()
        .then((response) => {
            if (response.status === 200) {
                callback(null, response.data);
            }
        })
        .catch((Err) => {
            callback(Err);
        });
}
