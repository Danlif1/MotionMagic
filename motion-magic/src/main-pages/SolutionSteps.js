import React, {useCallback, useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const SolutionSteps = ({serverResponseSolution}) => {
    //console.log('srs', serverResponseSolution,typeof(serverResponseSolution[0]));
    if (!serverResponseSolution) {
        return <div>No solution found.</div>; // Display message if no response
    }
    console.log(serverResponseSolution);
    return (
        <div>
            {serverResponseSolution[0].map((response, index) => (
                <div key={index}>
                    {response.split('\n').map((part, idx) => {
                        const mathParts = part.split(/(\$.*?\$)/); // Split by math parts wrapped in $

                        return (
                            <div key={idx}>
                                {mathParts.map((fragment, fragmentIdx) =>
                                    fragment.startsWith('$') && fragment.endsWith('$') ? (
                                        // Render as math content if it's wrapped in dollar signs
                                        <InlineMath key={fragmentIdx}>{fragment.slice(1, -1)}</InlineMath>
                                    ) : (
                                        // Render plain text otherwise
                                        <span key={fragmentIdx}>{fragment}</span>
                                    )
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}

        </div>
    )
}

export default SolutionSteps;