import { useEffect, useState } from 'react'
import DOMPurify from "dompurify";
import { useParams, Link } from 'react-router-dom';

const API_URL = "https://vpic.nhtsa.dot.gov/api";

type vehicleVariable = {
    DataType: string;
    Description: string;
    GroupName: string;
    ID: number;
    Name: string;
}

function Variables() {
    const { variableId } = useParams();

    const [response, setResponse] = useState<vehicleVariable[]>([]);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        fetch(API_URL +
            "/vehicles/getvehiclevariablelist" +
            "?format=json")
            .then(res => res.json())
            .then(res => res.Results)
            .then((res: vehicleVariable[]) => {
                setResponse(res);
            }).catch ((err: unknown) => {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError(String(err));
                }
            })
    }, [])

    // Failed to fetch variables
    if (error) return <p className="error">Error: {error}</p>

    // Fetching a list of variables (Request to "/variables/")
    if (!variableId) {
        return (
            <>
                <h1>Variable list:</h1>

                {response.map((item) => (
                    <div key={item.ID} className="variable">
                        <h2><Link to={"/variables/" + item.ID}>{item.Name}</Link></h2>
                        <span className="groupname">{"(" + item.GroupName + ")"}</span>
                        <span className="description"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(item.Description)
                            }}>
                        </span>
                    </div>
                ))}
            </>
        )
    }

    // Fetching a specific variable (Request to "/variables/{variableId}")
    const idNumber = Number(variableId);
    const variable = response.find(v => v.ID === idNumber);

    if (!variable && response.length > 0) {
        return <h1>Variable not found</h1>;
    }

    if (!variable) {
        return <p>Loading...</p>;
    }

    return (
    <>
        <h1>{variable.Name}</h1>
        <div dangerouslySetInnerHTML={{ __html: variable.Description }} />
    </>
    );
}

export default Variables