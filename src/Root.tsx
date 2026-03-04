import { useState } from 'react'
import './Root.css'

const API_URL = "https://vpic.nhtsa.dot.gov/api";

type vinResult = {
    Value: string;
    ValueId: string;
    Variable: string;
    VariableId: number;
}

type vinResponse = {
    Message: string;
    Results: vinResult[];
}

function Root() {
    // Form elements
    const [vin, setVin] = useState("");
    const [modelYear, setModelYear] = useState("");
    const [history, setHistory] = useState<string[]>([]); // Previously used VINs

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [response, setResponse] = useState<vinResponse | null>(null);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setResponse(null);
        
        // '*' is permitted by API to substitute for unavailable values.
        const vinRegex = /^[A-HJ-NPR-Z0-9\*]{17}$/i;
        if (!vinRegex.test(vin)) {
            setError("Invalid VIN. A VIN must be 17 characters long and cannot contain I, O, or Q.");
            return;
        }
        
        // Years 1900-current year
        const year = parseInt(modelYear, 10);
        const currentYear = new Date().getFullYear();

        if (!/^[12]\d{3}$/.test(modelYear) || year < 1900 || year > currentYear) {
            setError(`Invalid model year. Must be between 1900 and ${currentYear}.`);
            return;
        }

        setLoading(true);

        fetch(API_URL +
            "/vehicles/DecodeVin/" +
            encodeURIComponent(vin) +
            "?format=json&modelyear" +
            encodeURIComponent(modelYear)
        ).then(res => res.json())
        .then(data => {
            setResponse(data);

            // Update last 3 VINs, avoid duplicates
            setHistory(prev => {
                const newHistory = [vin, ...prev.filter(v => v !== vin)]
                return newHistory.slice(0,3);
            });
        })
        .catch ((err: unknown) => {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(String(err));
            }
        })
        .finally(() => setLoading(false));
    }

    return (
    <>
    <h1>VIN decoder</h1>
    <div className="card">
        <form onSubmit={handleSubmit}>
            <input type="text" className="textinput"
            id="vin"
            name="vin"
            value={vin}
            required
            onChange={(e) => setVin(e.target.value)}
            placeholder="VIN"
            maxLength={17}
            list="vin-suggestions"
            />

            <datalist id="vin-suggestions">
                {history.map((item, index) => (
                    <option key={index} value={item} />
                    // Appears as a list of suggestions when inputting a VIN
                ))}
            </datalist>

            <input type="text" className="textinput"
            id="modelYear"
            name="modelYear"
            value={modelYear}
            onChange={(e) => setModelYear(e.target.value)}
            placeholder="Model year (optional)"
            maxLength={4}
            />
            <button type="submit" className="submit" disabled={loading}>
                {loading ? "Decoding..." : "Decode"}
            </button>
        </form>
        <p><a href='/variables/'>Complete variable list</a></p>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {response && (
            <div>
                <strong>{response.Message}</strong>
                {response.Results.map((item) => {
                    if (item.Value) return (
                        <p key={item.VariableId}>
                            <a href={"/variables/" + item.VariableId}>{item.Variable}:</a> {item.Value}
                        </p>
                    )
                })}
            </div>
        )}
    </div>
    </>
    )
}

export default Root