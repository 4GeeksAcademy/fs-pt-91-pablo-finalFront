import PropTypes from "prop-types";
import React from "react";

export const Spinner = (props) => {
    return (
        <div className="d-flex flex-column gap-3 align-items-center justify-content-center">
            <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            {props.status}
        </div>
    )
}

Spinner.propTypes = {
    status: PropTypes.string
}