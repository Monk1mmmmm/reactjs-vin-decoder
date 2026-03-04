import { useState } from 'react'
import './Root.css'

function Root() {
  const [vin, setVin] = useState("");
  const [modelYear, setModelYear] = useState("");

  return (
    <>
      <h1>VIN decoder</h1>
      <div className="card">
        <form>
          <div>
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
            <input type="submit" className="submit"
            />
          </div>
        </form>
      </div>
    </>
  )
}

export default Root