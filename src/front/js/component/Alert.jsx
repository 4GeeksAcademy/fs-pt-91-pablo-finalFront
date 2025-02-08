import React, { useContext } from "react"
import { Context } from "../store/appContext"

export const Alert = () => {
    const { store } = useContext(Context)

    return (
        <div className={`w-75 mt-4 mx-auto alert alert-${store.alert.background} ${store.alert.visible || 'd-none'}`} role="alert">
            {store.alert.text}
        </div>
    )
}
