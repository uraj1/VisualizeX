import { addChart } from "@/app/actions/user";
import { useState } from "react";

type newProjectProps = {
  setFloat: React.Dispatch<React.SetStateAction<boolean>>;
  plots: 
  | {
      id: string;
      type: string;
      column: number;
      projectId: string;
    }[]
  | null;
  setPlots: React.Dispatch<React.SetStateAction<
  | {
      id: string;
      type: string;
      column: number;
      projectId: string;
    }[]
  | null>>;
  options:
    | {
        name: string;
        values: Number[];
      }[]
    | undefined;
    projectId: string
};

export default function NewPlot({
  setFloat,
  plots,
  setPlots,
  options,
  projectId
}: newProjectProps) {
  const [densityColumn, setDensityColumn] = useState(0);
  const [densityFloat, setDensityFloat] = useState<boolean>(false);

  const [areaFloat, setAreaFloat] = useState(false);
  const [areaColumn, setAreaColumn] = useState(0);

  const [histoFloat, setHistoFloat] = useState(false);
  const [histoColumn, setHistoColumns] = useState(0);

  const [lineFloat, setLineFloat] = useState(false);
  const [lineColumn, setLineColumn] = useState(0);

  //Function to take columns to view for Density Plot
  const DensityOptionWindow = () => {
    return (
      <div className="w-96 h-52 rounded-xl bg-gray-800 flex flex-col items-center px-8 pt-4">
        <h2 className="text-white text-lg font-semibold text-center pb-4">
          Choose a column
        </h2>
        <h2 className="text-xs text-red-600">
          Note: Columns with only numeric values are shown
        </h2>
        <select
          onChange={(e) => setDensityColumn(e.target.selectedIndex)}
          value={densityColumn}
          className="my-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {options?.map((option, index) => (
            <option
              className="text-md w-40 bg-gray-800 text-white max-h-16"
              key={index}
              value={index}
            >
              {option.name}
            </option>
          ))}
        </select>
        <div className="flex gap-2 justify-between">
          <button
            onClick={() => setFloat(false)}
            className="p-2 mt-3 w-32 bg-red-600 text-white text-md rounded-md hover:bg-red-500 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              await addChart(projectId, "Density", densityColumn)
              setFloat(false);
            }}
            className="p-2 mt-3 w-32 bg-blue-600 text-white text-md rounded-md hover:bg-blue-500 transition-colors duration-300"
          >
            Done
          </button>
        </div>
      </div>
    );
  };

  const AreaChartOptions = () => {
    return (
      <div className="w-96 h-52 rounded-xl bg-gray-800 flex flex-col items-center px-8 pt-4">
        <h2 className="text-white text-lg font-semibold text-center pb-4">
          Choose a column
        </h2>
        <h2 className="text-xs text-red-600">
          Note: Columns with only numeric values are shown
        </h2>
        <select
          onChange={(e) => setAreaColumn(e.target.selectedIndex)}
          value={areaColumn}
          className="my-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {options?.map((option, index) => (
            <option
              className="text-md w-40 bg-gray-800 text-white max-h-16"
              key={index}
              value={index}
            >
              {option.name}
            </option>
          ))}
        </select>
        <div className="flex gap-2 justify-between">
          <button
            onClick={() => setFloat(false)}
            className="p-2 mt-3 w-32 bg-red-600 text-white text-md rounded-md hover:bg-red-500 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              await addChart(projectId, "Area", areaColumn)
              setFloat(false);
            }}
            className="p-2 mt-3 w-32 bg-blue-600 text-white text-md rounded-md hover:bg-blue-500 transition-colors duration-300"
          >
            Done
          </button>
        </div>
      </div>
    );
  };

  const LinePlottOptions = () => {
    console.log("inlineplot")
    return (
      <div className="w-96 h-52 rounded-xl bg-gray-800 flex flex-col items-center px-8 pt-4">
        <h2 className="text-white text-lg font-semibold text-center pb-4">
          Choose a column
        </h2>
        <h2 className="text-xs text-red-600">
          Note: Columns with only numeric values are shown
        </h2>
        <select
          onChange={(e) => setLineColumn(e.target.selectedIndex)}
          value={lineColumn}
          className="my-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {options?.map((option, index) => (
            <option
              className="text-md w-40 bg-gray-800 text-white max-h-16"
              key={index}
              value={index}
            >
              {option.name}
            </option>
          ))}
        </select>
        <div className="flex gap-2 justify-between">
          <button
            onClick={() => setFloat(false)}
            className="p-2 mt-3 w-32 bg-red-600 text-white text-md rounded-md hover:bg-red-500 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              await addChart(projectId, "Line", lineColumn)
              setFloat(false);
            }}
            className="p-2 mt-3 w-32 bg-blue-600 text-white text-md rounded-md hover:bg-blue-500 transition-colors duration-300"
          >
            Done
          </button>
        </div>
      </div>
    );
  };

  const HistoPlotOptions = () => {
    return (
      <div className="w-96 h-52 rounded-xl bg-gray-800 flex flex-col items-center px-8 pt-4">
        <h2 className="text-white text-lg font-semibold text-center pb-4">
          Choose a column
        </h2>
        <h2 className="text-xs text-red-600">
          Note: Columns with only numeric values are shown
        </h2>
        <select
          onChange={(e) => setHistoColumns(e.target.selectedIndex)}
          value={histoColumn}
          className="my-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {options?.map((option, index) => (
            <option
              className="text-md w-40 bg-gray-800 text-white max-h-16"
              key={index}
              value={index}
            >
              {option.name}
            </option>
          ))}
        </select>
        <div className="flex gap-2 justify-between">
          <button
            onClick={() => setFloat(false)}
            className="p-2 mt-3 w-32 bg-red-600 text-white text-md rounded-md hover:bg-red-500 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              await addChart(projectId, "Histo", histoColumn)
              setFloat(false);
            }}
            className="p-2 mt-3 w-32 bg-blue-600 text-white text-md rounded-md hover:bg-blue-500 transition-colors duration-300"
          >
            Done
          </button>
        </div>
      </div>
    );
  };

  const Renderer = () => {
    if (densityFloat) {
      return <DensityOptionWindow />;
    } else if (areaFloat) {
      return <AreaChartOptions />;
    } else if (histoFloat) {
      return <HistoPlotOptions />;
    } else if (lineFloat) {
      return <LinePlottOptions />;
    } else {
      return (
        <div className="w-96 h-60 rounded-xl bg-gray-800 flex flex-col px-8 pt-4">
          <h2 className="text-white text-lg font-semibold text-center pb-4">
            Choose a plot
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setAreaFloat(true);
              }}
              className="flex gap-2 p-2 bg-fuchsia-600 text-white text-md rounded-md hover:bg-fuchsia-700 transition-colors duration-300"
            >
              <svg
                width="20px"
                height="25px"
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M888 792H200V168c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 8h752c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-616-64h536c4.4 0 8-3.6 8-8V284c0-7.2-8.7-10.7-13.7-5.7L592 488.6l-125.4-124a8.03 8.03 0 0 0-11.3 0l-189 189.6a7.87 7.87 0 0 0-2.3 5.6V720c0 4.4 3.6 8 8 8z" />
              </svg>
              Area Chart
            </button>

            <button
              onClick={() => {
                setDensityFloat(true);
              }}
              className="flex gap-2 p-2 bg-fuchsia-600 text-white text-md rounded-md hover:bg-fuchsia-700 transition-colors duration-300"
            >
              <svg
                className="mt-1"
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                viewBox="0 0 100 125"
                height="20px"
                width="15px"
              >
                <path d="M50,5C25.147,5,5,25.147,5,50c0,24.854,20.147,45,45,45c24.854,0,45-20.146,45-45C95,25.147,74.854,5,50,5z M23.642,71.239  c1.657-0.465,3.413-0.831,4.548-1.819c4.766-5.829,7.206-15.765,8.994-24.96c0.742-3.816,1.561-7.837,2.426-12.026  c0.641-3.1,2.332-12.421,6.467-9.802c1.949,1.234,2.916,4.439,3.738,7.378c1.666,5.933,2.914,11.573,4.447,17.584  c0.631,2.476,1.631,6.179,3.032,7.983c0.424,0.544,1.304,1.305,1.918,1.517c1.226,0.417,2.619-0.097,3.84,0.201  c2.075,0.504,3.349,2.949,4.446,4.951c1.046,1.903,2.271,4.254,3.538,5.76c1.595,1.897,3.265,3,6.771,3.134  C59.955,71.375,41.664,71.171,23.642,71.239z" />
              </svg>
              Density Chart
            </button>

            <button
              onClick={() => {
                setHistoFloat(true);
              }}
              className="flex gap-2 p-2 bg-fuchsia-600 text-white text-md rounded-md hover:bg-fuchsia-700 transition-colors duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                height="25px"
                width="25px"
                viewBox="0 -10 100 125"
              >
                <path d="M50,5C25.147,5,5,25.147,5,50c0,24.854,20.147,45,45,45c24.854,0,45-20.146,45-45C95,25.147,74.854,5,50,5z M66.626,46.908  h4.396v15.241h-4.396V46.908z M60.354,36.636h4.394v25.514h-4.394V36.636z M54.078,25.875h4.395v36.272h-4.395V25.875z   M47.803,18.439h4.396v43.708h-4.396V18.439L47.803,18.439z M41.529,28.418h4.395v33.729h-4.395V28.418z M35.254,42.31h4.395v19.838  h-4.395V42.31z M28.98,49.94h4.394v12.207H28.98V49.94z M22.706,46.888h4.395v15.26h-4.395V46.888z M77.081,71.019l-4.329,4.025  c-0.068,0.062-0.152,0.094-0.238,0.094c-0.096,0-0.188-0.037-0.258-0.111l-0.672-0.721c-0.062-0.066-0.1-0.158-0.096-0.252  c0.005-0.093,0.045-0.181,0.113-0.244l2.332-2.17H22.706v-1.758h51.228l-2.332-2.168c-0.067-0.062-0.107-0.15-0.111-0.245  c-0.004-0.093,0.031-0.184,0.094-0.252l0.672-0.721c0.133-0.142,0.354-0.149,0.497-0.019l4.329,4.024  c0.07,0.067,0.111,0.16,0.111,0.258C77.193,70.858,77.152,70.951,77.081,71.019z M77.293,62.147h-4.395V50.724h4.395V62.147z" />
              </svg>
              Histogram
            </button>

            <button
              onClick={() => {
                setLineFloat(true);
              }}
              className="flex gap-2 p-2 bg-fuchsia-600 text-white text-md rounded-md hover:bg-fuchsia-700 transition-colors duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                height="25px"
                width="25px"
                viewBox="0 -10 100 125"
              >
                <switch>
                  <foreignObject
                    requiredExtensions="http://ns.adobe.com/AdobeIllustrator/10.0/"
                    width="1"
                    height="1"
                  />
                  <g>
                    <g>
                      <path d="M89.854,86.667H12.188V12.334c0-0.553-0.447-1-1-1s-1,0.447-1,1v76.333h79.666c0.553,0,1-0.447,1-1     S90.406,86.667,89.854,86.667z" />
                      <path d="M21.63,82.088c0.168,0,0.339-0.011,0.51-0.032c2.197-0.279,3.758-2.294,3.48-4.492c-0.142-1.107-0.736-2.061-1.577-2.693     l8.195-19.769l11.078,17.758l9.153-42.393l7.948,41.197l16.929-50.227c0.217,0.036,0.437,0.062,0.663,0.062     c0.168,0,0.339-0.011,0.51-0.032c2.197-0.279,3.758-2.294,3.48-4.492c-0.277-2.168-2.277-3.763-4.492-3.479     c-2.196,0.279-3.757,2.294-3.479,4.492c0.136,1.069,0.695,1.987,1.487,2.621l-14.57,43.229L52.579,20.48L42.402,67.615     L31.879,50.746l-9.686,23.363c-0.347-0.05-0.7-0.07-1.065-0.024c-2.196,0.279-3.757,2.294-3.479,4.492     C17.903,80.578,19.614,82.088,21.63,82.088z M76.013,17.737c-0.124-0.978,0.479-1.881,1.383-2.173     c0.117-0.038,0.237-0.068,0.364-0.084c0.087-0.011,0.173-0.017,0.258-0.017c0.231,0,0.453,0.044,0.661,0.117     c0.703,0.247,1.238,0.871,1.337,1.646c0.14,1.104-0.645,2.116-1.748,2.256c-0.09,0.011-0.177,0.007-0.265,0.006     c-0.753-0.004-1.415-0.416-1.758-1.044C76.128,18.229,76.045,17.992,76.013,17.737z M21.381,76.069     c0.087-0.011,0.172-0.017,0.257-0.017c0.641,0,1.219,0.306,1.59,0.784c0.215,0.277,0.361,0.61,0.408,0.979     c0.14,1.104-0.645,2.116-1.748,2.256c-1.123,0.141-2.116-0.656-2.255-1.745C19.493,77.222,20.277,76.209,21.381,76.069     L21.381,76.069z" />
                    </g>
                  </g>
                </switch>
              </svg>
              Line Plot
            </button>

            <button
              onClick={() => setFloat(false)}
              className="col-span-2 p-2 bg-red-600 text-white text-md rounded-md hover:bg-red-500 transition-colors duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <Renderer />
    </>
  );
}
