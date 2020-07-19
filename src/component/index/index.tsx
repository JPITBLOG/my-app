import React,{Component} from 'react';
import { RouteComponentProps } from "react-router-dom";

import "./index.css";

import Header from "../Header/header";
import Slider from './slider';
import Subslider from './subslider';
import TabSlider from './tabSlider';
import Ptopic from '../courses/PopularTopic';
import Footer from '../Footer/footer';

interface State {}
interface Props {
    routeProps: RouteComponentProps
}
class Index extends Component<Props, State>{

    render(){
        return(
            <div>
                <Header routeProps={this.props.routeProps}/>
                <Slider/>
                <Subslider/>
                <div className="container">
                    <TabSlider routeProps={this.props.routeProps}/>
                    <Ptopic/>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default Index;
