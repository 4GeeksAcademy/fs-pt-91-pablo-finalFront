import PropTypes from "prop-types";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.js";
import { Link } from "react-router-dom";

export const Card = (props) => {
    const { store, actions } = useContext(Context);
    const [imageUrl, setImageUrl] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);

    const type = props.type === "characters" ? "people" : props.type;
    const extraData = `${type}/${props.uid}`;

    useEffect(() => {
        actions.starWarsApi.getImage(`${props.type}/${props.uid}`).then((data) => {
            setImageUrl(data);
        });
        setIsFavorite(store.favorites.find((val) => val.redirect === extraData));
    }, []);

    const handleSetFavorite = () => {
        if (isFavorite) {
            actions.removeFavorite(extraData);
        }
        else {
            actions.setFavorite({ redirect: extraData, label: props.name });
        }
        setIsFavorite(!isFavorite);
    };

    useEffect(() => {
        setIsFavorite(store.favorites.find((val) => val.redirect === extraData));

    }, [store.favorites]);

    return (
        <div className="card col p-0">
            <img src={imageUrl} className="card-img-top w-100" alt={`${props.name}'s picture`} />
            <div className="card-body d-flex flex-column justify-content-end">
                <h5 className="card-title">{props.name}</h5>
                <div className="d-flex justify-content-between">
                    <Link to={`./${props.uid}`}>
                        <button type="button" className="btn btn-primary">Details</button>
                    </Link>
                    <button type="button" className={`btn btn${isFavorite ? "" : '-outline'}-warning`} onClick={handleSetFavorite}><i className="fa-regular fa-heart"></i></button>
                </div>
            </div>
        </div>
    );
};

Card.propTypes = {
    type: PropTypes.string,
    name: PropTypes.string,
    uid: PropTypes.string
};
