import PropTypes from "prop-types";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const Card = (props) => {

    const { actions } = useContext(Context)
    const [imageUrl, setImageUrl] = useState("")

    useEffect(() => {
        const extraData = `${props.type}/${props.uid}`;
        actions.starWarsApi.getImage(extraData).then((data) => {
            setImageUrl(data)
        })
        
    }, [])
    return (
        <div className="card col p-0">
            <img src={imageUrl} className="card-img-top w-100" alt={`${props.name}'s picture`} />
            <div className="card-body d-flex flex-column justify-content-end">
              <h5 className="card-title">{props.name}</h5>
              <div className="d-flex justify-content-between">
                <Link to={`./${props.uid}`}>
                  <button type="button" className="btn btn-primary">Details</button>
                </Link>
                <button type="button" className="btn btn-outline-warning"><i className="fa-regular fa-heart"></i></button>
              </div>
            </div>
        </div>
    )
}

Card.propTypes = {
    type: PropTypes.string,
    name: PropTypes.string,
    uid: PropTypes.string
}