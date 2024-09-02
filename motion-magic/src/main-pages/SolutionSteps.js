import React, {useCallback, useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const SolutionSteps = ({serverResponseSolution}) => {
    return (
        <div>
            {serverResponseSolution.map((response, index) => (
                <div key={index}>
                    {response.split('\n').map((part, idx) => (
                        // Check if the part is an equation
                        part.includes('=') ? (
                            <div key={idx}>
                                <InlineMath>{part}</InlineMath>
                            </div>
                        ) : (
                            <div key={idx}>{part}</div>
                        )
                    ))}
                </div>
            ))}
        </div>
    )
}

export default SolutionSteps;