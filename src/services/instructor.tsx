import baseService from './baseServices';

export function getAllInstructors() {
    return baseService.get(`/instructor/getallInstructor`);
}