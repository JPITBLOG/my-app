import React, {Component} from 'react';
import './subslider.css';


class Subslider extends Component {
    render() {
        return (
            <div className=" how-udemy-works-container mb-3">
                <div className="how-udemy-works carousel-fullscreen-sidebar container" data-purpose="how-udemy-works">
                    <div className="row w-100">
                        <div className="col-lg-4">
                            <div className="how-udemy-works__col fx-lt">
                                <span className="how-udemy-works__icon"></span>
                                <div className="how-udemy-works__text">
                                    <b>100,000 online courses</b>
                                    <div className="how-udemy-works__sub-title">
                                        Explore a variety of fresh topics
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="how-udemy-works__col fx-ct">
                                <span className="how-udemy-works__icon2"></span>
                                <div className="how-udemy-works__text">
                                    <b>Expert instruction</b>
                                    <div className="how-udemy-works__sub-title">
                                        Find the right instructor for you
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="how-udemy-works__col fx-rt">
                                <span className="how-udemy-works__icon3"></span>
                                <div className="how-udemy-works__text">
                                    <b>Lifetime access</b>
                                    <div className="how-udemy-works__sub-title">
                                        Learn on your schedule
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Subslider;
