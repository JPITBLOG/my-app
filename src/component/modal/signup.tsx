import React from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Input,
    FormFeedback,
    Alert
} from "reactstrap";

interface SignUpProps {
    existUserErr: string,
    signUpModalProps: boolean,
    signUpToggle: () => void,
    btnSignUp: (event:any) => void,
    loginLinkInSignUp: () => void,
    onBlurFunction: any,
    onHandleChange: (event:any) => void,
    signUpData: {
        fullname: string,
        email: string,
        password: string
    },
    errorObject: {
        fullname: string,
        email: string,
        password: string
    }
}

const SignUp: React.SFC<SignUpProps> = (props) => {
    const {
            existUserErr,
            signUpModalProps,
            signUpToggle,
            btnSignUp,
            loginLinkInSignUp,
            onBlurFunction,
            onHandleChange,
            signUpData: {fullname, email, password},
            errorObject} = props;
            let fullnameError = errorObject.fullname;
            let emailError = errorObject.email;
            let passwordError = errorObject.password;
    return (
        <div>
            <Modal isOpen={signUpModalProps} toggle={signUpToggle} className={"signup"}>
                <ModalHeader toggle={signUpToggle}>Sign Up and Start Learning!</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            {existUserErr? (<Alert color = 'danger'>{existUserErr}</Alert>) : null}
                            <Input
                                type="text"
                                name="fullname"
                                id="fullname"
                                placeholder="Full Name"
                                onChange={onHandleChange}
                                onBlur={() => onBlurFunction('fullname')}
                                value={fullname || ''}
                                invalid={fullnameError !== ''}
                            />
                            <FormFeedback>{fullnameError}</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Email"
                                onChange={onHandleChange}
                                onBlur={() => onBlurFunction('email')}
                                value={email || ''}
                                invalid={emailError !== ''}
                            />
                            <FormFeedback>{emailError}</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Password"
                                onChange={onHandleChange}
                                onBlur={() => onBlurFunction('password')}
                                value={password || ''}
                                invalid={passwordError !== ''}
                            />
                            <FormFeedback>{passwordError}</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Button color="danger" onClick={btnSignUp}>Sign Up</Button>{' '}
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    Already have an account?
                    <Button color="btn-primary" onClick={loginLinkInSignUp}>Log In</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default SignUp;