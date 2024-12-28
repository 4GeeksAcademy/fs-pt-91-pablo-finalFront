import PropTypes from "prop-types";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const Pagination = (props) => {

    const {store, actions} = useContext(Context)

    const handlePageChange = (newPage) => {
        actions.starWarsApi.clear(props.type)
        const pageNumber = typeof newPage === "string" ? parseInt(newPage.split("page=")[1][0]) : newPage;
        const newUrl = `page=${pageNumber}&limit=10`;
        switch (props.type) {
            case "characters":
                actions.starWarsApi.getCharacters(newUrl)
                break;
            case "planets":
                actions.starWarsApi.getPlanets(newUrl)
                break;
            case "starships":
                actions.starWarsApi.getStarships(newUrl)
                break;
            default:
                break;
        }
        props.setCurrentPage(pageNumber)
    }

    const createPageNumbers = () => {
        const elements = [];

        for (let i = 1; i <= store[props.type].total_pages; i++) {
            elements.push((
                <li key={i} className={`page-item ${props.currentPage === i ? 'active': ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(i)}>{i}</button>
                </li>
            ))
        }
        return elements;
    }

    return (
        <ul className="pagination">
            <li className={`page-item ${props.currentPage == 1 ? 'disabled' : ''}`}>
                <button className="page-link rounded-0 rounded-end" onClick={() => handlePageChange(store[props.type].previous)}>&laquo;</button>
            </li>
            {createPageNumbers()}
            <li className={`page-item ${props.currentPage + 1 > store[props.type].total_pages ? 'disabled' : ''}`}>
                <button className="page-link rounded-0 rounded-start" onClick={() => handlePageChange(store[props.type].next)}>&raquo;</button>
            </li>
        </ul>
    )
}

Pagination.propTypes = {
    currentPage: PropTypes.number,
    setCurrentPage: PropTypes.func,
    type: PropTypes.string
}