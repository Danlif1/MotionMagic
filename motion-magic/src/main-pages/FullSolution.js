import ShowEquations from "./ShowEquations";
import SolutionSteps from "./SolutionSteps";
import React, {useState} from "react";
import Table from "./Table";
import FinalTableEvaluated from "./FinalTableEvaluated";


const FullSolution = ({problem,showTable=false,showFinalTableSol=false}) => {
    const [showft, setShowft] = useState(false);
    return (<>
        <h5>Equations:</h5>
        <ShowEquations equationsData={problem.Equations}/>
        <h5>Solution:</h5>
        <SolutionSteps serverResponseSolution={problem.Solution}/>
        {showTable && (<>
            <h5>Tables:</h5>
            <Table riders={problem.Riders} paths={problem.Paths} riderData={problem.RidersData}/>
        </>)}


        <FinalTableEvaluated riders={problem.Riders} paths={problem.Paths} riderData={problem.RidersData}
                             finalVarSolutionsScope={problem.FinalSolution} st={showft}/>
        <button className='collapse-button' style={{marginLeft: 0, fontSize: 20, color: "blue"}}
                onClick={() => setShowft(!showft)}>{!showft ? 'Show final table' : 'Hide final table'}</button>


    </>)
}

export default FullSolution;