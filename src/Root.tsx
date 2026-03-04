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

        setLoading(true);

        fetch(API_URL +
            "/vehicles/DecodeVin/" +
            encodeURIComponent(vin) +
            "?format=json&modelyear" +
            encodeURIComponent(modelYear)
        ).then(res => res.json())
        .then(setResponse)
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
            />
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

        {error && <p style={{ color: "red" }}>{error}</p>}

        {response && (
            <div>
                <strong>{response.Message}</strong>
                {response.Results.map((item, index) => {
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