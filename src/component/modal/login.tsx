import React from "react";
import {Button,
        Modal,
        ModalHeader,
        ModalBody,
        ModalFooter,
        Form,
        FormGroup,
        Input,
        Alert,
        FormFeedback} from "reactstrap";
import Facebook from "./facebook";


interface SignUpProps {
    logInModalProps: boolean,
    logInToggle: () => void,
    btnLogIn: (event: any) => void,
    signUpLinkInLogIn: () => void,
    onBlurFunction: any,
    onHandleChange: (event:any) => void,
    LogInData: {
        email: string,
        password: string
    },
    errorObject: {
        email: string,
        password: string
    },
    unAuthorize: string
}

const LogIn: React.FC<SignUpProps> = (props) => {
    const {logInModalProps,
            logInToggle,
            btnLogIn,
            signUpLinkInLogIn,
            onBlurFunction,
            onHandleChange,
            unAuthorize,
            LogInData: {email, password},
            errorObject} = props;
            let emailError = errorObject.email;
            let passwordError = errorObject.password;
    return (
        <div>
            <Modal isOpen={logInModalProps} toggle={logInToggle} className={"login"}>
                <ModalHeader toggle={logInToggle}>Log In to Your Udemy Account!</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            {unAuthorize? (<Alert color = 'danger'>{unAuthorize}</Alert>) : null}
                            <Facebook loginToggle = {logInToggle}/>
                            <Input type="email"
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
                            <Button
                                color="danger"
                                onClick={btnLogIn}>
                                Log In
                            </Button>{' '}
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                        Don't have an account?
                    <Button
                        color="btn-primary"
                        onClick={signUpLinkInLogIn}>
                        Sign Up
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default LogIn;