//custom node module
import React from 'react';
import {Router, Switch} from 'react-router-dom';
import {createBrowserHistory} from "history";

import './App.css';
import Index from "../index/index";
import Courses from "../courses/course";
import Topic from "../topic/topic";
import PageNotFound from "../pageNotFound";
import UnAuthorize from "../unAuthorize";
import CourseInDetail from "../detailCourse/CourseInDetail";
import ShoppingCart from "../cart/shoppingCart";
import Checkoutpag from "../CheckOut/CheckOut";
import PaymentSuccess from "../payment/paymentSuccess";
import Search from "../searchable/search";
import AdminDashbord from "../Admin/adminDashbord";
import AddCourse from "../Admin/addCourse";
import AddCourseVideo from "../Admin/addCourseVideo";
import CustomRoute from "../customRouting/CustomRoute";
const history = createBrowserHistory();
function App(props: any) {
    const admin = 1;
    const user = 0;
  return (
      <Router history={history} >
          <div>
              <Switch>
                    <CustomRoute exact path = "/" component={Index} />
                    <CustomRoute exact path = "/topic" component={Topic} />
                    <CustomRoute exact path = "/courses" component={Courses} />
                    <CustomRoute exact path = "/course-detail/" component={CourseInDetail} />
                    <CustomRoute exact path = "/cart/" component={ShoppingCart}/>
                    <CustomRoute cprivate = {true} role = {[user]} exact path = "/cart/checkout/" component={Checkoutpag}/>} />
                    <CustomRoute cprivate = {true} role = {[user]} exact path="/successful-payment/" component={PaymentSuccess} />
                    <CustomRoute exact path="/search/" component={Search} />
                    <CustomRoute cprivate = {true} role = {[admin]} exact path="/adminpenal/" component={AdminDashbord} />
                    <CustomRoute cprivate = {true} role = {[admin]} exact path="/adminpenal/addcourse/" component = {AddCourse} />
                    <CustomRoute cprivate = {true} role = {[admin]} exact path="/adminpenal/addcourse/addVideo" component = {AddCourseVideo} />
                    <CustomRoute path="/unauthorize" component={UnAuthorize} />
                    <CustomRoute component={PageNotFound} />
              </Switch>
          </div>
      </Router>
  );
}

export default App;
