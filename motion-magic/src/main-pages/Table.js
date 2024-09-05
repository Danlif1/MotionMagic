import React from "react";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
function do_nothing(a,b,c,d){
    return null
}

const Table = ({riders, paths,riderData,onChangeFunction=do_nothing, acceptChanges=false}) => {
    return (
        <div>
            {riders.map((rider, riderIndex) => (
                <div key={riderIndex} className="mt-4">
                    <h5 style={{margin: '10px'}}>{rider.Name}'s Table</h5>
                    <div className="d-flex justify-content-center">
                        <div className="table-responsive w-75">
                            <table className="table table-sm table-bordered text-center">
                                <thead className="thead-dark">
                                <tr>
                                    <th style={{ width: '10%' }}>Path</th>
                                    <th>Time</th>
                                    <th>Velocity</th>
                                    <th>Distance</th>
                                </tr>
                                </thead>
                                <tbody>
                                {paths.map((path, pathIndex) => (
                                    <tr key={pathIndex}>
                                        <td style={{maxWidth:'15px'}}><InlineMath math={path}/></td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Time"
                                                value={riderData[rider.Name]?.[pathIndex]?.Time || ''}
                                                onChange={(e) => onChangeFunction(rider.Name, pathIndex, 'time', e.target.value)}
                                                disabled={!acceptChanges}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Velocity"
                                                value={riderData[rider.Name]?.[pathIndex]?.Velocity || ''}
                                                onChange={(e) => onChangeFunction(rider.Name, pathIndex, 'velocity', e.target.value)}
                                                disabled={!acceptChanges}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Distance"
                                                value={riderData[rider.Name]?.[pathIndex]?.Distance || ''}
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
    )
}

export default Table;