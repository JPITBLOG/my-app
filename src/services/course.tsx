import baseService from './baseServices';

export function getAllCourses() {
    return baseService.get('/course/getallcourse');
}

export function addcourse(passDataObject: any) {
    return baseService.post('/course/addcourse',passDataObject);
}

export function addcourseVideoData(passvideoObject: any) {
    return baseService.post('/course/addcourseVideo',passvideoObject);
}
