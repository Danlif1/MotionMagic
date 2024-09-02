import React, {useCallback, useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'katex/dist/katex.min.css';
import {InlineMath} from 'react-katex';

const showEquations = ({equationsData}) => {
    return (
        <div>

            {equationsData.map((equation,index) => (
                <div key={index} className="mt-2">
                    <InlineMath math={equation}/>
                </div>

            ))}
        </div>
    )
}
export default showEquations;