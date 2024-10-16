import './ResultBox.scss';

interface ResultBoxProps {
    nominalValues: string[];
    errorValues: string[];
}

function ResultBox({ nominalValues, errorValues }: ResultBoxProps) {
    const nominalText = nominalValues.join('\n');
    const errorText = errorValues.join('\n');


    return (
        <div className="resultBox">
            <div className="nominalColumn resCol">
                <h3 className="nomTitle valTitle">Nominal Values</h3>
                <pre className="resultText">{nominalText}</pre>
            </div>
            <div className="errorColumn resCol">
                <h3 className="errTitle valTitle">Error Values</h3>
                <pre className="resultText">{errorText}</pre>
            </div>
        </div>
    );
}

export default ResultBox;