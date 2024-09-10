import React, {useState} from "react";
import * as math from 'mathjs';
import 'katex/dist/katex.min.css';
import {InlineMath} from 'react-katex';

function do_nothing(a, b, c, d) {
    return null
}

const FinalTableEvaluated = ({
                                 finalVarSolutionsScope,
                                 riders,
                                 paths,
                                 riderData,
                                 onChangeFunction = do_nothing,
                                 acceptChanges = false,
                                    st = false
                             }) => {
    const [error, setError] = useState(false);
    console.log(finalVarSolutionsScope)
    // let vJ = JSON.parse("{x:1}"
    //     .replace(/(\w+):/g, '"$1":')
    //     .replace(/'/g, '"'))

    function ev_expr(str) {

        try {
            console.log(`trying ${str} with ${finalVarSolutionsScope} scope`);

            let v = math.evaluate(str,finalVarSolutionsScope)
            return v
        } catch (e) {
            console.log(e)
            setError(true);
            return ''
        }
    }


    return (
        <>
            <div>
                Final Solutions:
                <div className='inline-math-container'>

                    <InlineMath math={Object.entries(finalVarSolutionsScope).map(([key, value]) => `${key}=${value}`).join(', ')}/>

                </div>
            </div>
            {!error && st && (
                <div>
                    <h5>Final Table:</h5>
                    {riders.map((rider, riderIndex) => (
                        <div key={riderIndex} className="mt-4">
                            <h5 style={{margin: '10px'}}>{rider.Name}'s Table</h5>
                            <div className="d-flex justify-content-center">
                                <div className="table-responsive w-75">
                                    <table className="table table-sm table-bordered text-center">
                                        <thead className="thead-dark">
                                        <tr>
                                            <th style={{width: '10%'}}>Path</th>
                                            <th>Time</th>
                                            <th>Velocity</th>
                                            <th>Distance</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {paths.map((path, pathIndex) => (
                                            <tr key={pathIndex}>
                                                <td style={{maxWidth: '15px'}}><InlineMath math={path}/></td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Time"
                                                        value={ev_expr(riderData[rider.Name][pathIndex].Time) || ''}
                                                        onChange={(e) => onChangeFunction(rider.Name, pathIndex, 'time', e.target.value)}
                                                        disabled={!acceptChanges}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Velocity"
                                                        value={ev_expr(riderData[rider.Name][pathIndex].Velocity) || ''}
                                                        onChange={(e) => onChangeFunction(rider.Name, pathIndex, 'velocity', e.target.value)}
                                                        disabled={!acceptChanges}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Distance"
                                                        value={ev_expr(riderData[rider.Name][pathIndex].Distance) || ''}
                                                        onChange={(e) => onChangeFunction(rider.Name, pathIndex, 'distance', e.target.value)}
                                                        disabled={!acceptChanges}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}


        </>)
}


export default FinalTableEvaluated;