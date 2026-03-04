# VIN decoder web app

An SPA application using NHTSA Vehicle API to decode data, encoded in VIN. ([Read more](https://vpic.nhtsa.dot.gov/api/)). Built using React and Vite.

Also hosted at GitHub Pages: [link](https://monk1mmmmm.github.io/reactjs-vin-decoder/) 

## Installation

Clone the repo and `cd` into the cloned directory. Install dependencies using `npm i`.

Run `npm run dev` to start up a debug server on localhost.

Run `npm run build` to build a production-ready version in `./dist` subdirectory.

## Usage

`http://<your_address>/` - The decoder application. Enter VIN and Model year (optional) to get the decoded data.

`http://<your_address>/variables/` - Variable documentation. Loads the full list of decodable data variables and their descriptions.

`http://<your_address>/variables/<variable_id>` - Variable documentation on a specific variable. Only returns data about a variable with a corresponding ID.