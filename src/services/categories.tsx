import baseService from './baseServices';

export function getAllCategories() {
    return baseService.get(`/categories/getallcategory`);
}

export function getAllSubcategories() {
    return baseService.get('/categories/getallsubcategory');
}