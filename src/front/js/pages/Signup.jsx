import React, { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Signup = () => {

    const { actions } = useContext(Context)

    const [firstName, setFirstName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPass, setConfirmPass] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const formRef = useRef(null)
    const passwordRef = useRef(null)
    const confirmPassRef = useRef(null)
    const navigate = useNavigate()

    const validateCorrectEmailFormat = () => {
        return email.match(/.+@.+\..+/)
    }

    const validateSamePassword = () => {
        return password === confirmPass
    }

    const validateForm = () => {
        if (!validateCorrectEmailFormat() || !validateSamePassword() || !formRef.current.checkValidity()) {
            if (!validateSamePassword()) {
                passwordRef.current.setCustomValidity("Passwords don't match.")
                confirmPassRef.current.setCustomValidity("Passwords don't match.")
            }
            else {
                passwordRef.current.setCustomValidity('')
                confirmPassRef.current.setCustomValidity('')
            }
            formRef.current.classList.add('was-validated')
            return false;
        }
        return true;
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!validateForm()) {
            event.stopPropagation()
            return;
        }
        const userData = {
            first_name: firstName,
            email: email,
            password: password,
            phone: phoneNumber
        }
        const response = await actions.signup(userData)
        if(response.statusCode !== 200) {
            return;
        }
        navigate('/settings')
    }

    return (
        <div className="w-100 m-auto needs-validation" style={{ maxWidth: 330, padding: '1rem' }} >
            <form onSubmit={handleSubmit} noValidate ref={formRef}>
                <h1 className="h3 mb-3 fw-normal">Sign up</h1>
                <div>
                    <label className='form-label' htmlFor="firstName">First name</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="form-control bg-dark text-white" id="firstName" placeholder="First name" required/>
                    <div className="invalid-feedback">
                        This field cannot be empty.
                    </div>
                </div>
                <div className='mt-3'>
                    <label className='form-label' htmlFor="email">Email address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control bg-dark text-white" id="email" placeholder="E-mail" required/>
                    <div className="invalid-feedback">
                        { email !== '' ? 'Incorrect email format' : 'This field cannot be empty.' }
                    </div>
                </div>
                <div className='mt-3'>
                    <label className='form-label' htmlFor="password">Password</label>
                    <div className="input-group">
                        <input className="form-control rounded-0 rounded-end bg-dark text-white" type={showPassword ? "text" : "password"} ref={passwordRef} value={password} onChange={(e) => setPassword(e.target.value)} id="password" placeholder="Password" required/>
                        <button className="btn btn-secondary rounded-0 rounded-start" type="button" onClick={() => setShowPassword(!showPassword)}><i className={`far fa-eye${showPassword ? '' : '-slash'}`}></i></button>
                    <div className="invalid-feedback">
                        { password === '' ? 'This field cannot be empty.' : "Passwords don't match." }
                    </div>
                    </div>
                </div>
                <div className='mt-3'>
                    <label className='form-label' htmlFor="confirmPass">Confirm password</label>
                    <div className="input-group">
                        <input className="form-control rounded-0 rounded-end bg-dark text-white" type={showPassword ? "text" : "password"} ref={confirmPassRef} value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} id="confirmPass" placeholder="Confirm password" required />
                        <button className="btn btn-secondary rounded-0 rounded-start" type="button" onClick={() => setShowPassword(!showPassword)}><i className={`far fa-eye${showPassword ? '' : '-slash'}`}></i></button>
                    <div className="invalid-feedback">
                        { confirmPass === '' ? 'This field cannot be empty.' : "Passwords don't match." }
                    </div>
                    </div>
                </div>
                <div className='mt-3'>
                    <label className='form-label' htmlFor="phone">Phone number</label>
                    <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="form-control bg-dark text-white" id="phone" placeholder="Phone number" />
                </div>
                <button className="btn btn-primary w-100 py-2 mt-4" type="submit">Sign in</button>

                <p className='mt-3 text-center'>Already have an account? <Link to='/login'>Log in</Link></p>
                
            </form>
        </div>
    );
};
