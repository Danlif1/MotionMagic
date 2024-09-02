import React from "react";


const Table = ({riders, paths,riderData,onChangeFunction}) => {
    return (
        <div>
            {riders.map((rider, riderIndex) => (
                <div key={riderIndex} className="mt-4">
                    <h3 style={{margin: '10px'}}>{rider.name}'s Table</h3>
                    <div className="d-flex justify-content-center">
                        <div className="table-responsive w-75">
                            <table className="table table-bordered text-center">
                                <thead className="thead-dark">
                                <tr>
                                    <th>Path</th>
                                    <th>Time</th>
                                    <th>Velocity</th>
                                    <th>Distance</th>
                                </tr>
                                </thead>
                                <tbody>
                                {paths.map((path, pathIndex) => (
                                    <tr key={pathIndex}>
                                        <td><InlineMath math={path}/></td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Time"
                                                value={riderData[rider.name]?.[pathIndex]?.time || ''}
                                                onChange={(e) => onChangeFunction(rider.name, pathIndex, 'time', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Velocity"
                                                value={riderData[rider.name]?.[pathIndex]?.velocity || ''}
                                                onChange={(e) => onChangeFunction(rider.name, pathIndex, 'velocity', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Distance"
                                                value={riderData[rider.name]?.[pathIndex]?.distance || ''}
                                                onChange={(e) => onChangeFunction(rider.name, pathIndex, 'distance', e.target.value)}
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