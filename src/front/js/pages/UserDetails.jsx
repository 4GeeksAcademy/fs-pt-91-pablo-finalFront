import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const UserDetails = () => {
    const { store, actions } = useContext(Context)
    const [userData, setUserData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const getUserData = async() => {
        const data = await actions.getUser(store.user.id)
        setUserData(data)
    }

    useEffect(() => {
        setIsLoading(true)
        if (!store.isLogged) {
            navigate('/login')
            return;
        }
        getUserData()
        setIsLoading(false)
    }, [])

    const handleLogout = () => {
        actions.logout()
        navigate('/login')
    }

    return (
        <div>
            {store.isLogged && !isLoading && userData && 
            <div className="card mb-3">
                <div className="card-header bg-dark border-0 m-auto">
                    <h2>Hello, {userData.first_name}!</h2>
                </div>
                <div className="row g-0 m-auto">
                    <div>
                        <p><b className="text-warning">Name:</b> {userData.first_name} </p>
                        <p><b className="text-warning">E-mail:</b> {userData.email} </p>
                        <p><b className="text-warning">Phone number:</b> {userData.phone} </p>
                    </div>
                </div>
                <div className="m-auto mb-2">
                    <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        }
        </div>
    )
}
