import React from "react";
import "./User.scss";
import axios from "axios";
import {CONFIG} from "../../config";
import Auth from "../../utils/Auth/Auth";
import swal from 'sweetalert';

class User extends React.Component {

    state = {
        loaded: false,
        formControls: {
            name: {
                value: '',
                errorMessage: ''
            },
            email: {
                value: '',
                errorMessage: ''
            },
            password: {
                value: '',
                errorMessage: ''
            },
            repassword: {
                value: '',
                errorMessage: ''
            }
        }
    }

    inputOnBlurHandler = (controlName) => {
        const formControls = {...this.state.formControls};
        formControls[controlName].errorMessage = '';
        this.setState(formControls);
    }

    componentDidMount = () => {
        axios.get(CONFIG.apiServer + "api/user", {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + Auth.loggedApiKey
            }
        }).then((res) => {
            const formControls = this.state.formControls;
            formControls.name.value = res.data.data.name
            formControls.email.value = res.data.data.email
            this.setState({
                formControls: formControls,
                loaded: true
            });
        }).catch((error) => {
            Auth.logOut();
        });
    }

    inputOnChangeHandler = (e, controlName) => {
        const formControls = {...this.state.formControls};
        formControls[controlName].value = e.target.value;

        this.setState(formControls);
    }

    changeName = () => {
        if (this.state.formControls.name.value.length !== 0) {
            axios.put(CONFIG.apiServer + "api/user", {
                name: this.state.formControls.name.value
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + Auth.loggedApiKey
                }
            }).then((res) => {
                swal("Good job!", "Name successful saved!", "success");
            }).catch(() => {
                swal("Bad!", "Something went wrong!", "error");
            });
        } else {
            const formControls = {...this.state.formControls};
            formControls.name.errorMessage = 'This field is required';
            this.setState({formControls});
        }
    }

    changeEmail = () => {
        if (this.state.formControls.email.value.length !== 0) {
            // eslint-disable-next-line
            let validEmailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (validEmailRegex.test(this.state.formControls.email.value)) {
                axios.put(CONFIG.apiServer + "api/user", {
                    email: this.state.formControls.email.value
                }, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + Auth.loggedApiKey
                    }
                }).then((res) => {
                    swal("Good job!", "Email successful saved!", "success");
                }).catch((error) => {
                    if (error.response.status === 404) {
                        console.log(error.response.data)
                        if (error.response.data.data.email && error.response.data.data.email === 'Email already exists.') {
                            const formControls = {...this.state.formControls};
                            formControls.email.errorMessage = 'Email already exists';
                            this.setState({formControls});
                            return ;
                        }
                    }
                    swal("Bad!", "Something went wrong!", "error");
                });
            } else {
                const formControls = {...this.state.formControls};
                formControls.email.errorMessage = 'Invalid email';
                this.setState({formControls});
            }
        } else {
            const formControls = {...this.state.formControls};
            formControls.email.errorMessage = 'This field is required';
            this.setState({formControls});
        }
    }

    changePassword = () => {
        const formControls = {...this.state.formControls};
        if (this.state.formControls.password.value.length === 0) {
            formControls.password.errorMessage = 'This field is required';
            this.setState({formControls});
            return ;
        }

        if (this.state.formControls.repassword.value.length === 0) {
            formControls.repassword.errorMessage = 'This field is required';
            this.setState({formControls});
            return ;
        }

        if (this.state.formControls.repassword.value !== this.state.formControls.password.value) {
            formControls.repassword.errorMessage = 'Fields must be equals';
            this.setState({formControls});
            return ;
        }

        axios.put(CONFIG.apiServer + "api/user", {
            password: this.state.formControls.password.value
        }, {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + Auth.loggedApiKey
            }
        }).then((res) => {
            formControls.repassword.value = '';
            formControls.password.value = '';
            this.setState({formControls});
            swal("Good job!", "Password successful saved!", "success");
        }).catch(() => {
            swal("Bad!", "Something went wrong!", "error");
        });
    }

    render() {
        if (!this.state.loaded) {
            return (
                <div className="container">
                    <div className="default-block">
                        <h4>Loading...</h4>
                    </div>
                </div>
            );
        }
        return (
            <div className="container">
                <div className="default-block">
                    <h2 className="block-title">User settings</h2>
                    <div className="user-change-info-block">
                        <div className="user-setting-form-block">
                            <div className="row">
                                <div className="col-4">
                                    <h3 className="option-title">Name</h3>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <input type="text" className="form-control default-input" name="name"
                                               placeholder="Name"
                                               value={this.state.formControls.name.value}
                                               onChange={(e) => {this.inputOnChangeHandler(e, 'name')}}
                                               onBlur={(e) => {this.inputOnBlurHandler('name')}}/>
                                        <small className="error-message">{this.state.formControls.name.errorMessage}</small>
                                    </div>
                                    <div className="form-group text-center">
                                        <button className="btn default-btn" onClick={this.changeName}>Change</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="user-setting-form-block">
                            <div className="row">
                                <div className="col-4">
                                    <h3 className="option-title">Change password</h3>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <input type="password" className="form-control default-input"
                                               name="new_password"
                                               placeholder="New password" value={this.state.formControls.password.value}
                                               onChange={(e) => {this.inputOnChangeHandler(e, 'password')}}
                                               onBlur={(e) => {this.inputOnBlurHandler('password')}}/>
                                        <small className="error-message">{this.state.formControls.password.errorMessage}</small>
                                    </div>
                                    <div className="form-group">
                                        <input type="password" className="form-control default-input" name="re_password"
                                               placeholder="Re-password" value={this.state.formControls.repassword.value}
                                               onChange={(e) => {this.inputOnChangeHandler(e, 'repassword')}}
                                               onBlur={(e) => {this.inputOnBlurHandler('repassword')}}/>
                                        <small className="error-message">{this.state.formControls.repassword.errorMessage}</small>
                                    </div>
                                    <div className="form-group text-center">
                                        <button className="btn default-btn" onClick={this.changePassword}>Change</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="user-setting-form-block">
                            <div className="row">
                                <div className="col-4">
                                    <h3 className="option-title">Email</h3>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <input type="email" className="form-control default-input" name="email"
                                               placeholder="Email"
                                               value={this.state.formControls.email.value}
                                               onChange={(e) => {this.inputOnChangeHandler(e, 'email')}}
                                               onBlur={(e) => {this.inputOnBlurHandler('email')}}/>
                                        <small className="error-message">{this.state.formControls.email.errorMessage}</small>
                                    </div>
                                    <div className="form-group text-center">
                                        <button className="btn default-btn" onClick={this.changeEmail}>Confirm new email</button>
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

export default User;
