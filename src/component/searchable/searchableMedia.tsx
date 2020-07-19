import React,{Component, MouseEvent} from "react";
import {RouteComponentProps} from "react-router-dom";
import {Media} from "reactstrap";
import poster from "../../Assets/slider.png";
import './search.css';
import {fullCourseData} from "../../interfaces/CourseInDetailComponent";

interface Props {
    key: number,
    fullcourseInfo: fullCourseData,
    price: number,
    discount: number,
    routeProps: RouteComponentProps
}

interface State {

}

class SearchableMedia extends Component<Props, State>{

    onCourseClick(event: MouseEvent,fullCourse: fullCourseData){
        this.props.routeProps.history.push({pathname:'/course-detail/',state:fullCourse,search:"?id="+fullCourse._id});
    }

    render(){
        // @ts-ignore
        return(
            <Media className="searchable-wrap container"
                   fullcourse = {this.props.fullcourseInfo} key = {this.props.key}
                   onClick={(event) => this.onCourseClick(event,this.props.fullcourseInfo)}>
                <Media left>
                    <Media object src={this.props.fullcourseInfo.course_Img} height = "100px" width = "100px"/>
                </Media>
                <Media body>
                    <Media heading>
                        <div className='d-flex justify-content-between'>
                            <div className="title-content">
                                {this.props.fullcourseInfo.category_Name}
                            </div>
                            <div className='price-list'>
                                <p className='course-rate'>{this.props.discount}</p>
                                <p className='course-rate'>{this.props.price}</p>
                            </div>
                        </div>
                    </Media>
                    <div className="subtitle-content">
                        {this.props.fullcourseInfo.course_Subtitle+" | created by "}<b>{this.props.fullcourseInfo.created_By[0]}</b>
                    </div>
                </Media>
            </Media>
        );
    }
}

export default SearchableMedia;