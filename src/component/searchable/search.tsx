import React,{Component} from "react";
import {RouteComponentProps} from "react-router-dom";
import SearchableMedia from './searchableMedia'
import {fullCourseData} from "../../interfaces/CourseInDetailComponent";

import Header from "../Header/header";
import Footer from "../Footer/footer";

interface Props {
    routeProps: RouteComponentProps
}

interface State {
    sortedBy: string,
    noDataFound: boolean
}

class Search extends Component<Props, State>{
    constructor(props: Props){
        super(props);
        this.state = {
            sortedBy:"0",
            noDataFound: false
        }
    }


    mappData = () => {
        const that = this;
        let filtredData = [];
        const locationState = this.props.routeProps.location.state;
        if (locationState instanceof Array) {
            filtredData = locationState && locationState.map(function (course: fullCourseData,index: number){
                let price = parseInt(String(course.price));
                let offer = parseInt(String(course.offer));
                let discount = parseInt(String(price - ((price * offer) / 100)));

                if(that.state.sortedBy === "lowestPrice") {
                    if(discount < 500) {
                        return (<SearchableMedia key = {index} fullcourseInfo = {course} price = {price}
                                                 discount = {discount} routeProps = {that.props.routeProps} />)
                    }
                }
                else if(that.state.sortedBy === "highestPrice"){
                    if(discount > 500){
                        return (<SearchableMedia key = {index} fullcourseInfo = {course} price = {price}
                                                 discount = {discount} routeProps = {that.props.routeProps} />)
                    }
                }
                else if(that.state.sortedBy === "0"){
                    return (<SearchableMedia key = {index} fullcourseInfo = {course} price = {price}
                                             discount = {discount} routeProps = {that.props.routeProps} />)
                }
                return true;
            });
            return filtredData;
        }
        else {
            if (!this.state.noDataFound) {
                this.setState({noDataFound: true});
            }
        }
    }

    setsortedState = (event: React.FormEvent<HTMLSelectElement>) => {
        let setvalue = event.currentTarget.value;
        this.setState({
            sortedBy:setvalue
        });
    }

    render() {
        return (
            <div>
                <Header routeProps={this.props.routeProps} />
                {!this.state.noDataFound?
                <div className="page-container">
                <table>
                    <tbody>
                    <tr className="hide_all">
                        <td>
                            <select id="select" onChange = {this.setsortedState.bind(this)} defaultValue={0}>
                                <option value={0}>Sort</option>
                                <option value="lowestPrice">Lowest Price</option>
                                <option value="highestPrice">Highest Price</option>
                            </select>
                        </td>
                        <td>Courses</td>
                    </tr>
                    </tbody>
                </table>
                    {this.mappData()}
                </div>
                    : <div className="page-container">
                        <h3 style={{fontWeight: "bold", padding: "25px"}}>
                            {`Sorry, we couldn't find any results for "${this.props.routeProps.location.state}"`}
                        </h3>
                        <h5 style={{fontWeight: "bold", paddingTop: "0px", paddingBottom: "20px", paddingLeft: "25px"}}>Try adjusting your search. Here are some ideas:</h5>
                        <ul style={{fontWeight: "bold"}}>
                            <li className="list-data">Make sure all words are spelled correctly</li>
                            <li className="list-data">Try different search terms</li>
                            <li className="list-data">Try more general search terms</li>
                        </ul>
                    </div>}
                <Footer/>
            </div>
        );
    }
}
export default Search;
