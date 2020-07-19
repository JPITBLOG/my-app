import React,{Component} from 'react';
import {RouteComponentProps} from 'react-router-dom';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

interface Prop {
    routeProps: RouteComponentProps
}

interface State {
    collapsed: boolean
}

class AdminavBar extends Component<Prop, State> {
    constructor(props: Prop) {
        super(props);
        this.state = {
            collapsed: true
        };
        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.addCourseAction = this.addCourseAction.bind(this);
        this.goToadmin = this.goToadmin.bind(this);
    }

    goToadmin = () => {
        this.props.routeProps.history.push({pathname: '/adminpenal/'});
    }

    addCourseAction = () => {
        this.props.routeProps.history.push({pathname:'/adminpenal/addcourse/'});
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }
    render() {
        return (
            <div>
                <Navbar color="faded" light>
                    <NavbarBrand onClick = {this.goToadmin} className="mr-auto">Admin</NavbarBrand>
                    <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                    <Collapse isOpen={!this.state.collapsed} navbar>
                        <Nav navbar>
                            <NavItem>
                                <NavLink onClick={this.addCourseAction}>Add Course</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}

export default AdminavBar;