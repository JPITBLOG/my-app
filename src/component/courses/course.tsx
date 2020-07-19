import React, {Component} from "react";

import {Nav, NavItem, NavLink} from "reactstrap";

import Header from '../Header/header';
import {getAllCategory} from "../../action/categories";

import {categories} from "../../interfaces/category";
import {Props, State} from "../../interfaces/courseComponent";
import Ptopic from "./PopularTopic";
import InstructorSlider from "./instructor";
import Display from "./Display";

import "./courses.css";
import Footer from "../Footer/footer";


class Courses extends Component<Props, State> {

    private matchCategory = false;

    constructor(props: Props) {
        super(props);
        this.state = {
            allCategories: []
        }
    }

    clickHandle = (event: React.FormEvent<HTMLInputElement>, getCategoryArray: string[]) => {
        this.props.routeProps.history.push({pathname: '/' + getCategoryArray[1] + '/', state: getCategoryArray[0]});
    };

    subcategories = (subcategory: categories[]) => {
        let scategory = [];
        scategory = subcategory.filter(function (subcategory) {
            return subcategory.name.slice(0, 3) !== "All"
        });
        scategory = scategory.map((category,index) => {
            return (<div key={index} className="navbar-item">
                <NavItem key = {"navItem"+index}>
                    <NavLink onClick={(event) => this.clickHandle(event, [category.name, "courses"])}
                             key={category.name}>{category.name}</NavLink>
                </NavItem>
            </div>)
        });
        return scategory;
    };

    getCategory = () => {
        const that = this;
        let subCategoryArray: categories | null | undefined;

        that.state.allCategories.map(async function (category, ctgryIndex) {
            if (category.name === that.props.routeProps.location.state) {
                subCategoryArray = null;
                subCategoryArray = category;
                that.matchCategory = true;
            }
            else {
                await category.subcategory!.map(function (subCategories) {
                    if (subCategories.name === that.props.routeProps.location.state) {
                        subCategoryArray = null;
                        subCategoryArray = category;
                        subCategories.subcategory!.length? that.matchCategory = true : that.matchCategory = false
                    }
                    return true;
                });
            }
        });

        if (subCategoryArray !== undefined) {
            return (
                <Nav className="navbar-wrap">
                    <NavItem key={subCategoryArray!.name+" navbar"}>
                        <NavLink key={subCategoryArray!.name+" navLink "}
                                 onClick={(event) => that.clickHandle(event, [subCategoryArray!.name, "courses"])}>{subCategoryArray!.name}</NavLink>
                    </NavItem>
                    {that.subcategories(subCategoryArray!.subcategory!)}
                </Nav>
            );
        }
    }

    async componentDidMount() {
        await getAllCategory((err: object, response: categories[]) => {
            if (response) {
                this.setState({allCategories: response});
            }
        });
    }

    async componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        if (JSON.stringify(prevState.allCategories) !== JSON.stringify(this.state.allCategories)) {
            await getAllCategory((err: object, response: categories[]) => {
                if (response) {
                    this.setState({allCategories: response});
                }
            });
        }
    }

    render() {
        const getcategory = this.getCategory();
        const h1Style = {
            'marginTop': '0px'
        };
        return  (
                <div>
                    <Header routeProps = {this.props.routeProps}/>
                    {this.matchCategory ? (
                    <div key={"courses"}>
                        {getcategory}
                        <div  data-size={this.props.routeProps.location.state}
                             className="course-container jumbotron__collapsed browse-full-width-container--full-width-container--1v4rg browse-full-width-container--is-desktop--169rt">
                            <div className="browse-container suppress-xl jumbotron__title" style={h1Style}>
                                <h1 className="gradiant-course"><p className="course-header">{this.props.routeProps.location.state}</p>
                                </h1>
                            </div>
                            <div className="course-content">
                                <h2 className="category--section-title--3SLWt">Courses to get you started</h2>
                                <Display routeProps = {this.props.routeProps} />
                                <div className="unit-title--title-box--3tVMv">
                                    <h2 className="c_discovery-units__title" data-us="0"
                                        data-purpose="discovery-unit-1953376954">
                                        Popular topics
                                    </h2>
                                </div>
                                <Ptopic/>
                                <div className="unit-title--title-box--3tVMv">
                                    <h2 className="c_discovery-units__title" data-us="0"
                                        data-purpose="discovery-unit-1953376954">
                                        Popular Instructors
                                    </h2>
                                </div>
                                <InstructorSlider/>
                            </div>
                        </div>
                    </div>
                        ) : (
                            <div className="page-container">
                                <h3>Data is not available</h3>
                            </div>
                    )}
                    <Footer/>
                </div>
        );
    }
}

export default Courses;