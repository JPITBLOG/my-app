import React, {Component} from "react";
import {Props, State} from "../../interfaces/topicComponent";
import Header from "../Header/header";
import Display from "./Display";
import MediaTopic from "./MediaTopic";
import Banner from "./Banner";
import Filter from "./Filter";
import './topic.css';
import Footer from "../Footer/footer";

class Topic extends Component<Props, State>{
    render(){
        // @ts-ignore
        // @ts-ignore
        // @ts-ignore
        return (
            <div>
                <Header routeProps={this.props.routeProps}/>
                <div>
                    <div className="topic-jumbotron--gradient-border--7UpZf"></div>
                    <div className="container">
                        <h1 className="topic-jumbotron--title--2u9Hn">{this.props.routeProps.location.state + " "}Courses </h1>
                        <h2 className="topic--section-heading--UrZPh">Courses to get you started</h2>
                        {/*<Display routeProps = {this.props.routeProps} />*/}
                        <Display routeProps={this.props.routeProps}/>
                        <Banner key="Banner"/>
                        <Filter key="Filter" topic={this.props.routeProps.location.state}/>
                        <MediaTopic key="MediaTopic" routeProps={this.props.routeProps}/>
                    </div>
                </div>
                <Footer/>
            </div>

        );
    }
}

export default Topic;