import React, {Component} from 'react';
import { RouteComponentProps } from "react-router-dom";
import {Tabs, Tab} from 'react-bootstrap';
import Display from "../courses/Display";
import {getAllCategory} from "../../action/categories";
import {categories} from "../../interfaces/category";

interface Prop {
    routeProps: RouteComponentProps
}

interface State {
    key: string | null,
    categoryData: categories[] | [],
}

class TabSlider extends Component<Prop, State> {

    constructor(props: Prop) {
        super(props);
        this.state = {
            key:null,
            categoryData: []
        };
        this.handleSelect = this.handleSelect.bind(this)
    }
    handleSelect(key: string) {
        if(key !== this.state.key){
            this.setState({key});
        }
    }

    getAllcategory(){
        let categoryFilter: string[] | [] = [];
        let Allfilteredtopic = [];
        let categoryTab: any[] = [];
        const that = this;
        try {
            if (that.state.categoryData.length) {
                // @ts-ignore
                that.state.categoryData.map(function (category: categories, index: number) {
                    let subcategoryFilter = category.subcategory!.filter((subcategory) => {
                        return subcategory.subcategory!.length > 0;
                    })
                    if (subcategoryFilter.length > 0) {
                        // @ts-ignore
                        categoryFilter.push(category.name);
                        let ctgryTopic: string[] = [];
                        subcategoryFilter.map(function (subtopic, index) {
                            subtopic.subcategory!.map(function (topic, index) {
                                ctgryTopic.push(topic.name);
                                return true;
                            })
                            return true;
                        });
                        Allfilteredtopic.push(ctgryTopic);
                    }
                    return 0;
                });
                if(that.state.key == null){
                    that.setState({key:categoryFilter[0]})
                }

                // @ts-ignore
                categoryFilter.map(function (category: string, index: number) {
                    categoryTab.push(<Tab key={index+""+category} eventKey={category} title={category}>{category}</Tab>);
                    return true;
                });
                return categoryTab;
            }
        }
        catch (e) {
            console.log("there is an error while fetching subcategory data: ",e);
        }
    }

    componentDidMount() {
        getAllCategory((err: object, response: categories[]) => {
            if (response) {
                this.setState({categoryData: response});
            }
        });
    }

    async componentDidUpdate(prevProps: Readonly<Prop>, prevState: Readonly<State>, snapshot?: any) {
        if (JSON.stringify(prevState.categoryData) !== JSON.stringify(this.state.categoryData)) {
            getAllCategory((err: object, response: categories[]) => {
                if (response) {
                    this.setState({categoryData: response});
                }
            });
        }
    }

    render () {
        this.props.routeProps.location.state = this.state.key;
        return(
            <div key={"DisplayAtTabDiv"} className="tab-data">
                <Tabs activeKey={this.state.key} onSelect={this.handleSelect}
                      id="controlled-tab-example">
                    {this.getAllcategory()}
                </Tabs>
                <Display key={"DisplayAtTab"} topic={this.state.key} routeProps={this.props.routeProps} />
            </div>
        );
    }
}

export default TabSlider;
