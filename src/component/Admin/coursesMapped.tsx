import React,{Component, MouseEvent} from 'react';
import {Media} from "reactstrap";
import poster from '../../Assets/slider.png';
import {fullCourseData} from "../../interfaces/CourseInDetailComponent";
import {RouteComponentProps} from "react-router-dom";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRupeeSign} from "@fortawesome/free-solid-svg-icons";

interface Prop {
    cardData: fullCourseData[] | [],
    routeProps: RouteComponentProps
}

interface State {

}

class CoursesMapped extends Component<Prop, State>{
    private cardData: fullCourseData[] = [];
    constructor(props: Prop){
        super(props);
        this.cardData = [];
        this.setData = this.setData.bind(this);
        this.courseDetail = this.courseDetail.bind(this);
    }

    courseDetail = (event: MouseEvent<HTMLElement>,course: fullCourseData) => {
        this.props.routeProps.history.push({pathname:'/course-detail/',state:course,search:"?id="+course._id})
    }

    setData = () => {
        const that = this;
        let filtredData = [];
        filtredData = this.cardData.map(function (course,index){
            let price = parseInt(String(course.price));
            let offer = parseInt(String(course.offer));
            let discount = parseInt(String(price - ((price * offer) / 100)));
            return(<Media className="main-wrap adminCourse" key={index}>
                <Media left>
                    <Media object src={course.course_Img} height="100px" width="100px"/>
                </Media>
                <Media body>
                    <Media heading>
                        <div className='course-wrap'>
                            <div className='d-flex flex-column w-75'>
                                <p>{course.course_Name}</p>
                                <p className="instructorName">{course.created_By.join(',')}</p>
                            </div>
                            <div className='d-flex flex-column remove-text'>
                                <p><a onClick={(event) =>that.courseDetail(event,course)}>{"Detail"}</a></p>
                            </div>
                            <div className='price-list'>
                                <p><FontAwesomeIcon icon={faRupeeSign} />{discount}</p>
                                {discount === price ? null
                                    :
                                    <p style={{ textDecorationLine: 'line-through' }}><FontAwesomeIcon icon={faRupeeSign} />{price}</p>
                                }
                            </div>
                        </div>
                    </Media>
                    <div>

                    </div>
                </Media>
            </Media>);
        });

        return filtredData;
    }

    render(){
        this.cardData = [];
        this.cardData = this.props.cardData;
        return(
            <div>
                <div>
                    {this.setData()}
                </div>
            </div>
        );
    }
}

export default CoursesMapped;
