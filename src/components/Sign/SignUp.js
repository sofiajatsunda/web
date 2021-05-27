import React from 'react';
import {Link} from "react-router-dom";
import Input from "../../utils/UI/Input/Input"
import Validation from "../../utils/Validation/Validation";
import {CONFIG} from "../../config";
import axios from "axios";

class SingIn extends React.Component {

    state = {

        formControls: {
            name: {
                type: 'text',
                placeholder: 'Name',
                value: '',
                valid: false,
                errorMessage: 'Enter valid name',
                iconClassName: 'fas fa-user',
                showValidate: false,
                validation: {
                    required: true,
                    minLength: 3,
                    maxLength: 60
                }
            },
            email: {
                type: 'email',
                placeholder: 'Email',
                value: '',
                valid: false,
                errorMessage: 'Enter valid email',
                iconClassName: 'fas fa-envelope',
                showValidate: false,
                validation: {
                    required: true,
                    email: true
                }
            },
            password: {
                type: 'password',
                placeholder: 'Password',
                value: '',
                valid: false,
                errorMessage: 'Enter valid password',
                iconClassName: 'fas fa-lock',
                showValidate: false,
                validation: {
                    required: true,
                    minLength: 8,
                    maxLength: 30,
                    minCountLetters: 1,
                    minCountUpperCase: 1,
                    minCountLowerCase: 1,
                    minCountDigits: 1,
                    passwordSymbols: true,
                }
            },
            repassword: {
                type: 'password',
                placeholder: 'Re-password',
                value: '',
                valid: false,
                errorMessage: 'Enter valid repassword',
                iconClassName: 'fas fa-lock',
                showValidate: false,
                validation: {
                    required: true,
                    equalTo: 'password'
                }
            }
        },
    }

    onBlur = (controlName) => {
        const formControls = {...this.state.formControls};
        const control = {...formControls[controlName]};
        control.showValidate = true;
        formControls[controlName] = control;

        this.setState({
            formControls
        });
    }

    onChangeHandler = (event, controlName) => {
        const formControls = {...this.state.formControls};
        const control = {...formControls[controlName]};

        control.value = (event.target).value;
        let validateControlInfo = this.validateControl(control.value, control.validation);

        control.valid = validateControlInfo.isValid;
        if (validateControlInfo.errorMessage !== '') {
            control.errorMessage = validateControlInfo.errorMessage;
        }

        formControls[controlName] = control;

        this.setState({
            formControls
        });
    };

    validateControl = (value, validation) => {
        if (!validation) {
            return {isValid: true, errorMessage: ''};
        }

        let validator = new Validation();

        let isValid = true;
        let errorMessage = '';

        if (validation.required && isValid) {
            isValid = !validator.isEmpty(value);
            if (!isValid) errorMessage = 'Field is required.';
        }

        if (validation.email && isValid) {
            isValid = validator.checkEmail(value);
            if (!isValid) errorMessage = 'Invalid email.';
        }

        if (validation.minLength && isValid) {
            isValid = validator.checkMinLength(value, validation.minLength);
            if (!isValid) errorMessage = 'You should put minimum ' + validation.minLength + ' chars.';
        }

        if (validation.maxLength && isValid) {
            isValid = validator.checkMaxLength(value, validation.maxLength);
            if (!isValid) errorMessage = 'You can put maximum ' + validation.maxLength + ' chars.';
        }

        if (validation.equalTo && isValid) {
            isValid = (value === this.state.formControls[validation.equalTo].value);
            if (!isValid) errorMessage = 'Passwords should be equal.';
        }

        if (validation.minCountLetters && isValid) {
            isValid = validator.checkPasswordSymbols(value);
            if (!isValid) errorMessage = 'You can use only latin letters, numbers and symbols(!,#,$,%,&,*,+,?,@,^)';
        }

        if (validation.minCountUpperCase && isValid) {
            isValid = validator.checkMinCountUpperCase(value, validation.minCountUpperCase);
            if (!isValid) errorMessage = 'You should put minimum ' + validation.minCountUpperCase + ' letter(s) in upper case.';
        }

        if (validation.minCountLowerCase && isValid) {
            isValid = validator.checkMinCountLowerCase(value, validation.minCountLowerCase);
            if (!isValid) errorMessage = 'You should put minimum ' + validation.minCountLowerCase + ' letter(s) in lower case.';
        }

        if (validation.minCountDigits && isValid) {
            isValid = validator.checkMinCountDigits(value, validation.minCountDigits);
            if (!isValid) errorMessage = 'You should put minimum ' + validation.minCountDigits + ' digit(s).';
        }

        if (validation.onlyLatin && isValid) {
            isValid = (value === this.state.formControls[validation.equalTo].value);
            if (!isValid) errorMessage = 'Passwords should be equal.';
        }

        return {isValid: isValid, errorMessage: errorMessage};
    };


    renderInputs = () => {
        const inputs = Object.keys(this.state.formControls).map((controlName, index) => {
            const control = this.state.formControls[controlName];
            return (
                <Input
                    key={controlName + index}
                    type={control.type}
                    placeholder={control.placeholder}
                    valid={control.valid}
                    iconClassName={control.iconClassName}
                    showValidate={control.showValidate}
                    onChange={(e) => this.onChangeHandler(e, controlName)}
                    errorMessage={control.errorMessage}
                    onBlur={() => this.onBlur(controlName)}
                    value={control.value}
                />
            );
        });

        return inputs;
    };

    handleSubmit = (event) => {
        event.preventDefault();

        let isValid = true;
        const formControls = {...this.state.formControls};

        Object.keys(formControls).forEach((controlName) => {

            let control = {...formControls[controlName]};

            control.showValidate = true;
            formControls[controlName] = control;

            if (!control.valid && isValid) {
                isValid = false;
            }
        });

        if (isValid) {
            axios.post(CONFIG.apiServer + "api/register", {
                name: formControls.name.value,
                email: formControls.email.value,
                password: formControls.password.value,
            }, {
                headers: {
                    'Accept': 'application/json'
                }
            }).then((res) => {
                window.location.href = "/signin";
            }).catch((error) => {
                if (error.response.data.data.email === "Email already exists.") {
                    let control = formControls.email;
                    control.valid = false;
                    control.showValidate = true;
                    control.errorMessage = 'User with the same email already exists.';
                    formControls.email = control;
                    this.setState({
                        formControls
                    });
                } else {
                    alert("Unknown error");
                }
            });
        } else {
            this.setState({
                formControls
            });
        }
    };

    render() {
        return (
            <React.Fragment>
                <h1>Sign Up</h1>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInputs()}
                    <div className="sign-button-wrapper">
                        <button type="submit" className="btn default-btn">Create</button>
                    </div>
                    <div className="other-type-sign">
                        <h3>Have account already?</h3>
                        <Link to={'/signin'}>Sign In</Link>
                    </div>
                </form>
            </React.Fragment>
        );
    }
}

export default SingIn;
