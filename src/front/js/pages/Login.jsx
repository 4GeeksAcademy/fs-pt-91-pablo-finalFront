import React, { useContext, useState } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const Login = () => {

    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async(event) => {
        event.preventDefault()
        const dataToSend = {
            email: email,
            password: password
        }
        const response = await actions.login(dataToSend)

        if(response.status === 401) {
            return;
        }
        navigate('/settings')
        
    }

    return (
        <div className="w-100 m-auto" style={{ maxWidth: 330, padding: '1rem' }}>
            <form onSubmit={handleSubmit}>
                <h1 className="h3 mb-3 fw-normal">Log in</h1>
                <div>
                    <label className='form-label' htmlFor="floatingInput" style={{ left: 0 }}>Email address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control bg-dark text-white" id="floatingInput" placeholder="E-mail" />
                </div>
                <div className='mt-3'>
                    <label className='form-label' htmlFor="floatingPassword" style={{ left: 0 }}>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control bg-dark text-white" id="floatingPassword" placeholder="Password" />
                </div>
                <button className="btn btn-primary w-100 py-2 mt-4" type="submit">Sign in</button>
                <p className='mt-3 text-center'>Don't have an account? <Link to='/signup'>Sign up</Link></p>
            </form>
        </div>
    );
};
