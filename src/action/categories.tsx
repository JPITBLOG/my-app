import {getAllCategories, getAllSubcategories} from '../services/categories';

export const getAllCategory = (callback: any) => {
    getAllCategories()
        .then((response) => {
            if (response.status === 200) {
                callback(null, response.data);
            }
        })
        .catch((Err) => {
            callback(Err);
        });
}

export const getAllSubcategoriesData = (callback: any) => {
    getAllSubcategories()
        .then((response) => {
            if(response.status === 200){
                callback(null, response.data);
            }
        }).catch((error) => {
            if(error.response){
                callback(error.response);
            }
        });
};
