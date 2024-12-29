import React, { useContext, useEffect, useState } from "react";
import { Card } from "../component/Card.jsx";
import { Context } from "../store/appContext.js";
import { Spinner } from "../component/Spinner.jsx";
import { Pagination } from "../component/Pagination.jsx";

export const CharactersList = () => {
    const { store } = useContext(Context);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setIsLoading(store.people.results === undefined);

        if(store.people.results !== undefined) {
            if(store.people.next === null) {
                setIsLoading(store.people.total_pages)
            } else {
                const nextPageNumber = parseInt(store.people.next.split("page=")[1][0]);
                setCurrentPage(nextPageNumber - 1);
            }
        }
    }, [store.people]);

    return (
        <div className="container-fluid mt-5">
            {isLoading
                ?
                <Spinner status="Cargando personajes..." />
                :
                <div className="d-flex flex-column align-items-center gap-5">
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 gap-5 justify-content-center">
                        {store.people.results?.map((character) =>
                            <Card
                                key={`character_${character.uid}`}
                                type="characters"
                                name={character.name}
                                uid={character.uid}
                            />
                        )}
                    </div>
                    <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} type="people" />
                </div>
            }
        </div>
    );
};
