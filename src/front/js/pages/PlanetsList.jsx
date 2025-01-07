import React, { useContext, useEffect, useState } from "react";
import { Card } from "../component/Card.jsx";
import { Context } from "../store/appContext.js";
import { Spinner } from "../component/Spinner.jsx";
import { Pagination } from "../component/Pagination.jsx";

export const PlanetsList = () => {
    const { store } = useContext(Context);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setIsLoading(store.planets.results === undefined);

        if(store.planets.results !== undefined) {
            if(store.planets.next === null) {
                setIsLoading(store.planets.total_pages)
            } else {
                const nextPageNumber = parseInt(store.planets.next.split("page=")[1][0]);
                setCurrentPage(nextPageNumber - 1);
            }
        }
    }, [store.planets]);

    return (
        <div className="container-fluid mt-5">
            {isLoading
                ?
                <Spinner status="Cargando planetas..." />
                :
                <div className="d-flex flex-column align-items-center gap-5">
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 gap-5 justify-content-center">
                        {store.planets.results?.map((character) =>
                            <Card
                                key={`planet_${character.uid}`}
                                type="planets"
                                name={character.name}
                                uid={character.uid}
                            />
                        )}
                    </div>
                    <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} type="planets" />
                </div>
            }
        </div>
    );
};
