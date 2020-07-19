import React from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Input,
    NavLink,
    Alert,
    Label,
    FormFeedback
} from "reactstrap";

interface imageFile {
    lastModified: number
    lastModifiedDate?: any
    name: string
    size: number
    type: string
    webkitRelativePath?: string
}

interface Prop {
    isOpen: boolean,
    toggle: () => void,
    onlinkclick: () => void,
    adminOnBlurFunction: any,
    adminHandleChange: (event: React.FormEvent<HTMLInputElement>) => void,
    signUpData: {
        name: string,
        eml: string,
        profession: string,
        selfDesc: string,
        password: string,
        selectedFile: imageFile | null
    },
    adminSignUpError: {
        name: string,
        eml: string,
        profession: string,
        selfDesc: string,
        password: string,
        selectedFile: string
    },
    existUserErr: string,
    btnAdminSignUp: () => void;
}

interface State {

}

const AdminRegister: React.SFC<Prop> = (props) => {
    const {
        adminHandleChange,
        onlinkclick,
        signUpData: {
            name,
            eml,
            profession,
            selfDesc,
            password
        },
        adminSignUpError,
        existUserErr,
        btnAdminSignUp,
        adminOnBlurFunction
    } = props;
    return (
        <Modal isOpen={props.isOpen} toggle={props.toggle} className={"AdminRegister"}>
            <ModalHeader toggle={props.toggle}>Sign Up and Make Course!</ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        {existUserErr? (<Alert color = 'danger'>{existUserErr}</Alert>) : null}
                        <Input type="text"
                               name="name"
                               id="nam"
                               placeholder="Full Name"
                               onChange = {adminHandleChange}
                               onBlur={() => adminOnBlurFunction('name')}
                               value = {name || ''}
                               invalid={adminSignUpError.name !== ''}/>
                        <FormFeedback>{adminSignUpError.name}</FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <Input type="email"
                               name="eml"
                               id="email"
                               placeholder="Email"
                               onChange = {adminHandleChange}
                               onBlur={() => adminOnBlurFunction('eml')}
                               value = {eml || ''}
                               invalid={adminSignUpError.eml !== ''}/>
                        <FormFeedback>{adminSignUpError.eml}</FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <Input type="textarea"
                               name="profession"
                               id="profession"
                               placeholder="Profession"
                               onChange = {adminHandleChange}
                               onBlur={() => adminOnBlurFunction('profession')}
                               value = {profession || ''}
                               invalid={adminSignUpError.profession !== ''}/>
                        <FormFeedback>{adminSignUpError.profession}</FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <Input type="textarea"
                               name="selfDesc"
                               id="selfDesc"
                               placeholder="Self Description"
                               onChange = {adminHandleChange}
                               onBlur={() => adminOnBlurFunction('selfDesc')}
                               value = {selfDesc || ''}
                               invalid={adminSignUpError.selfDesc !== ''}/>
                        <FormFeedback>{adminSignUpError.selfDesc}</FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <Input type="password"
                               name="password"
                               id="Password"
                               placeholder="Password"
                               onChange = {adminHandleChange}
                               onBlur={() => adminOnBlurFunction('password')}
                               value = {password || ''}
                               invalid={adminSignUpError.password !== ''}/>
                        <FormFeedback>{adminSignUpError.password}</FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <Label for="learn">Add Image</Label>
                        <input type="file"
                               name="selectedFile"
                               id="imgFile"
                               onChange={adminHandleChange}
                               />
                        <FormFeedback>{adminSignUpError.selectedFile}</FormFeedback>
                    </FormGroup>
                    <Button className="btn-primary" onClick={btnAdminSignUp}>Sign Up</Button>
                </Form>
            </ModalBody>
            <ModalFooter>
                <p>Already have an account?</p>
                <NavLink onClick={onlinkclick}>Log In</NavLink>
            </ModalFooter>
        </Modal>
    );
}

export default AdminRegister;