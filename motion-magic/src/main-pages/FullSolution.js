import ShowEquations from "./ShowEquations";
import SolutionSteps from "./SolutionSteps";
import React from "react";
import Table from "./Table";


const FullSolution = ({problem,showTable=false}) => {
    return (<>
        <h5>Equations:</h5>
        <ShowEquations equationsData={problem.Equations}/>
        <h5>Solution:</h5>
        <SolutionSteps serverResponseSolution={problem.Solution}/>
        {showTable && (<>
            <h5>Table:</h5>
            <Table riders={problem.Riders} paths={problem.Paths} riderData={problem.RidersData}/>
        </>)}

    </>)
}

export default FullSolution;