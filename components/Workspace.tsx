"use client";
import { Density } from "./Plots/DensityChart";
import { LineChart } from "./Plots/Lineplot";
import { AreaChart } from "./Plots/Areachart";
import { Histogram } from "./Plots/Histogram";
import { useState, useEffect } from "react";
import NewPlot from "./NewPlot";
import * as d3 from "d3";
import "dotenv/config";
import { useRouter } from "next/navigation";
import Delete from "./Delete";
import {
  deleteChart,
  getAllCharts,
  getProjectDetails,
  updateCsvLink,
} from "@/app/actions/user";
import AWS from "aws-sdk";
import { useSession } from "next-auth/react";

type commonData = {
  name: string;
  values: number[];
};

type areaData = {
  x: number;
  y: number;
};

export default function Workspace({ id }: { id: string }) {
  const router = useRouter();
  const [options, setOptions] = useState<string[]>([]);
  const [rows, setRows] = useState<(string[] | number[])[]>([]);
  const [processedData, setProcesseddata] = useState<commonData[]>();
  const [uploading, setUploading] = useState(false);
  const [float, setFloat] = useState(false);
  const [del, setDel] = useState<boolean>(false);
  const [trigger, setTrigger] = useState(false);
  const [isFile, setIsFile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [plots, setPlots] = useState<
    | {
        id: string;
        type: string;
        column: number;
        projectId: string;
      }[]
    | null
  >([]);

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  const session = useSession();
  if (session.status === "unauthenticated") {
    router.push("/");
  }

  async function parseCSV(address: string) {
    try {
      const rows_arr: (string[] | number[])[] = [];
      //GET REQUEST HERE FOR CSV FETCHING
      const data = await d3.csv(address);
      setOptions(Object.keys(data[0]));
      data.map((d) => {
        rows_arr.push(Object.values(d));
      });
      setRows(rows_arr);
    } catch (e) {
      console.log("Unexpected error occured: ", e);
    }
  }

  function preProcessor(column_names: string[], rows: (string[] | number[])[]) {
    let finalcommonData: commonData[] = [];
    for (let i = 0; i < column_names?.length; i++) {
      const name = column_names[i];
      var values: number[] = [];

      //This condition is used to skip an iteration whenever it encounters a true string in the first column element, since it cannot be used for any plotting
      //Regex is used to check whether if it is a string
      if (!/^\d+(\.\d+)?$/.test(rows[0][i].toString())) continue;

      for (let j = 0; j < rows?.length; j++)
        values.push(parseFloat(rows[j][i] as string));

      //await new Promise((resolve) => setTimeout(resolve, 100));
      finalcommonData.push({
        name: name,
        values: values,
      });
    }
    setProcesseddata(finalcommonData);
    return;
  }

  function extractColumnData(
    data: commonData[],
    columnIndex: number
  ): areaData[] {
    return data[0].values.map((_, index) => ({
      x: index + 1,
      y: data[columnIndex].values[index],
    }));
  }

  async function handleFileUpload(file: any) {
    setUploading(true);
    const region = "ap-south-1";
    const accessKeyId = process.env.NEXT_PUBLIC_accessKeyId || "";
    const secretAccessKey = process.env.NEXT_PUBLIC_secretAccessKey || "";

    AWS.config.update({
      region: region,
      credentials: new AWS.Credentials(accessKeyId, secretAccessKey),
    });
    const params = {
      Bucket: "bucket.visualprod",
      Key: file?.name as string,
      Body: file || undefined,
    };
    const s3 = new AWS.S3();
    s3.upload(
      params,
      async (
        err: any,
        data: {
          Location: string;
          Bucket: string;
          Key: string;
        }
      ) => {
        await updateCsvLink(id, data.Location);
        setIsFile(true);
        setUploading(false);
      }
    );
  }

  const PlotsRenderer = () => {
    return plots?.map((plot) => {
      if (plot.type === "Density") {
        const c = plot.column;
        if (processedData) {
          return (
            <div key={plot.id} className="bg-gray-500 rounded-xl">
              <div className="flex justify-between px-3">
                <h2 className="pt-1">
                  Density Chart:{" "}
                  <span className="text-gray-200">
                    {processedData[c].name}:
                  </span>{" "}
                </h2>
                <svg
                  className="hover:cursor-pointer"
                  onClick={async () => {
                    await deleteChart(plot.id);
                    setTrigger(!trigger);
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  width="35px"
                  height="35px"
                  viewBox="0 0 100 125"
                >
                  <g>
                    <path d="M63.5,89.7c7.6,0,13.7-5.9,14-13.5l1.6-49.4h7.5c1.1,0,2-0.9,2-2s-0.9-2-2-2H65.6v-4.5c0-4.4-3.6-8-8-8H42.4   c-4.4,0-8,3.6-8,8v4.5H13.3c-1.1,0-2,0.9-2,2s0.9,2,2,2h7.5l1.6,49.4c0.3,7.6,6.4,13.5,14,13.5H63.5z M38.4,18.3c0-2.2,1.8-4,4-4   h15.2c2.2,0,4,1.8,4,4v4.5H38.4V18.3z M26.5,76l-1.6-49.3h50.3L73.5,76c-0.2,5.4-4.6,9.7-10,9.7h-27C31.1,85.7,26.7,81.5,26.5,76z" />
                    <path d="M50,72.9c1.1,0,2-0.9,2-2V41c0-1.1-0.9-2-2-2s-2,0.9-2,2v29.9C48,72,48.9,72.9,50,72.9z" />
                    <path d="M38,72.9c1.1,0,2-0.9,2-2V41c0-1.1-0.9-2-2-2s-2,0.9-2,2v29.9C36,72,36.9,72.9,38,72.9z" />
                    <path d="M62,72.9c1.1,0,2-0.9,2-2V41c0-1.1-0.9-2-2-2s-2,0.9-2,2v29.9C60,72,60.9,72.9,62,72.9z" />
                  </g>
                </svg>
              </div>
              <Density
                data={processedData.slice(c, c + 1)}
                width={
                  windowSize.width < 770
                    ? windowSize.width / 1.2
                    : windowSize.width / 2.5
                }
                height={windowSize.height / 2.5}
              />
            </div>
          );
        } else return <div key={plot.id}></div>;
      } else if (plot.type === "Area") {
        const c = plot.column;

        if (processedData) {
          const transformedData: areaData[] = extractColumnData(
            processedData,
            c
          );
          return (
            <div key={plot.id} className="bg-gray-500 rounded-xl">
              <div className="flex justify-between px-3">
                <h2>
                  Area Chart:{" "}
                  <span className="text-gray-200">
                    {processedData[c].name}:
                  </span>
                </h2>
                <svg
                  className="hover:cursor-pointer"
                  onClick={async () => {
                    await deleteChart(plot.id);
                    setTrigger(!trigger);
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  width="35px"
                  height="35px"
                  viewBox="0 0 100 125"
                >
                  <g>
                    <path d="M63.5,89.7c7.6,0,13.7-5.9,14-13.5l1.6-49.4h7.5c1.1,0,2-0.9,2-2s-0.9-2-2-2H65.6v-4.5c0-4.4-3.6-8-8-8H42.4   c-4.4,0-8,3.6-8,8v4.5H13.3c-1.1,0-2,0.9-2,2s0.9,2,2,2h7.5l1.6,49.4c0.3,7.6,6.4,13.5,14,13.5H63.5z M38.4,18.3c0-2.2,1.8-4,4-4   h15.2c2.2,0,4,1.8,4,4v4.5H38.4V18.3z M26.5,76l-1.6-49.3h50.3L73.5,76c-0.2,5.4-4.6,9.7-10,9.7h-27C31.1,85.7,26.7,81.5,26.5,76z" />
                    <path d="M50,72.9c1.1,0,2-0.9,2-2V41c0-1.1-0.9-2-2-2s-2,0.9-2,2v29.9C48,72,48.9,72.9,50,72.9z" />
                    <path d="M38,72.9c1.1,0,2-0.9,2-2V41c0-1.1-0.9-2-2-2s-2,0.9-2,2v29.9C36,72,36.9,72.9,38,72.9z" />
                    <path d="M62,72.9c1.1,0,2-0.9,2-2V41c0-1.1-0.9-2-2-2s-2,0.9-2,2v29.9C60,72,60.9,72.9,62,72.9z" />
                  </g>
                </svg>
              </div>
              <AreaChart
                data={transformedData}
                width={
                  windowSize.width < 770
                    ? windowSize.width / 1.2
                    : windowSize.width / 2.5
                }
                height={windowSize.height / 2.5}
              />
            </div>
          );
        } else return <div key={plot.id}></div>;
      } else if (plot.type === "Histo") {
        const c = plot.column;
        if (processedData) {
          return (
            <div key={plot.id} className="bg-gray-500 rounded-xl">
              <div className="flex justify-between px-3">
                <h2>
                  Histogram:{" "}
                  <span className="text-gray-200">
                    {processedData[c].name}:
                  </span>
                </h2>
                <svg
                  className="hover:cursor-pointer"
                  onClick={async () => {
                    await deleteChart(plot.id);
                    setTrigger(!trigger);
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  width="35px"
                  height="35px"
                  viewBox="0 0 100 125"
                >
                  <g>
                    <path d="M63.5,89.7c7.6,0,13.7-5.9,14-13.5l1.6-49.4h7.5c1.1,0,2-0.9,2-2s-0.9-2-2-2H65.6v-4.5c0-4.4-3.6-8-8-8H42.4   c-4.4,0-8,3.6-8,8v4.5H13.3c-1.1,0-2,0.9-2,2s0.9,2,2,2h7.5l1.6,49.4c0.3,7.6,6.4,13.5,14,13.5H63.5z M38.4,18.3c0-2.2,1.8-4,4-4   h15.2c2.2,0,4,1.8,4,4v4.5H38.4V18.3z M26.5,76l-1.6-49.3h50.3L73.5,76c-0.2,5.4-4.6,9.7-10,9.7h-27C31.1,85.7,26.7,81.5,26.5,76z" />
                    <path d="M50,72.9c1.1,0,2-0.9,2-2V41c0-1.1-0.9-2-2-2s-2,0.9-2,2v29.9C48,72,48.9,72.9,50,72.9z" />
                    <path d="M38,72.9c1.1,0,2-0.9,2-2V41c0-1.1-0.9-2-2-2s-2,0.9-2,2v29.9C36,72,36.9,72.9,38,72.9z" />
                    <path d="M62,72.9c1.1,0,2-0.9,2-2V41c0-1.1-0.9-2-2-2s-2,0.9-2,2v29.9C60,72,60.9,72.9,62,72.9z" />
                  </g>
                </svg>
              </div>
              <Histogram
                data={processedData[c].values}
                width={
                  windowSize.width < 770
                    ? windowSize.width / 1.2
                    : windowSize.width / 2.5
                }
                height={windowSize.height / 2.5}
              />
            </div>
          );
        } else return <div key={plot.id}></div>;
      } else if (plot.type === "Line") {
        const c = plot.column;

        if (processedData) {
          const transformedData: areaData[] = extractColumnData(
            processedData,
            c
          );
          return (
            <div key={plot.id} className="bg-gray-500 rounded-xl">
              <div className="flex justify-between px-3">
                <h2>
                  Line Plot:{" "}
                  <span className="text-gray-200">
                    {processedData[c].name}:
                  </span>
                </h2>
                <svg
                  className="hover:cursor-pointer"
                  onClick={async () => {
                    await deleteChart(plot.id);
                    setTrigger(!trigger);
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  width="35px"
                  height="35px"
                  viewBox="0 0 100 125"
                >
                  <g>
                    <path d="M63.5,89.7c7.6,0,13.7-5.9,14-13.5l1.6-49.4h7.5c1.1,0,2-0.9,2-2s-0.9-2-2-2H65.6v-4.5c0-4.4-3.6-8-8-8H42.4   c-4.4,0-8,3.6-8,8v4.5H13.3c-1.1,0-2,0.9-2,2s0.9,2,2,2h7.5l1.6,49.4c0.3,7.6,6.4,13.5,14,13.5H63.5z M38.4,18.3c0-2.2,1.8-4,4-4   h15.2c2.2,0,4,1.8,4,4v4.5H38.4V18.3z M26.5,76l-1.6-49.3h50.3L73.5,76c-0.2,5.4-4.6,9.7-10,9.7h-27C31.1,85.7,26.7,81.5,26.5,76z" />
                    <path d="M50,72.9c1.1,0,2-0.9,2-2V41c0-1.1-0.9-2-2-2s-2,0.9-2,2v29.9C48,72,48.9,72.9,50,72.9z" />
                    <path d="M38,72.9c1.1,0,2-0.9,2-2V41c0-1.1-0.9-2-2-2s-2,0.9-2,2v29.9C36,72,36.9,72.9,38,72.9z" />
                    <path d="M62,72.9c1.1,0,2-0.9,2-2V41c0-1.1-0.9-2-2-2s-2,0.9-2,2v29.9C60,72,60.9,72.9,62,72.9z" />
                  </g>
                </svg>
              </div>
              <LineChart
                data={transformedData}
                width={
                  windowSize.width < 770
                    ? windowSize.width / 1.2
                    : windowSize.width / 2.5
                }
                height={windowSize.height / 2.5}
              />
            </div>
          );
        } else return <div key={plot.id}></div>;
      }
    });
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window?.addEventListener("resize", handleResize);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    async function init() {
      const project = await getProjectDetails(id);
      if (project?.csv !== null) {
        await parseCSV(project?.csv as string);
        setIsFile(true);
      }
    }
    init();
  }, [isFile]);

  useEffect(() => {
    if (options.length && rows.length) {
      preProcessor(options, rows);
    }
  }, [rows, options]);

  useEffect(() => {
    async function init() {
      const allCharts = await getAllCharts(id);
      setLoading(false);
      setPlots(allCharts);
    }
    init();
  }, [float, trigger]);

  return (
    <div className="bg-gray-900">
      {/* Top Bar */}
      <div className="flex justify-between border-b-fuchsia-400 border-b-2 mb-6">
        <h2 className="text-white text-2xl pb-4 font-bold">Plots</h2>
        {!isFile ? (
          uploading ? (
            <div className="flex w-20 h-10 mb-3 sm:mb-0">
              <label className="flex flex-col items-center justify-center w-44 border-2 border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-500">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mt-3"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 64 80"
                    fill="none"
                    x="0px"
                    y="100px"
                  >
                    <path
                      d="M18.9286 2C14.8089 2 11.0982 3.76412 8.52598 6.57214C7.77988 7.38664 7.83533 8.65175 8.64983 9.39785C9.46432 10.144 10.7294 10.0885 11.4755 9.27401C13.3191 7.26143 15.9729 6 18.9286 6C24.5021 6 29 10.4883 29 16C29 21.5117 24.5021 26 18.9286 26C14.8129 26 11.2838 23.5526 9.71913 20.053C10.1906 19.9796 10.6375 19.7382 10.9623 19.3389C11.6593 18.482 11.5296 17.2223 10.6727 16.5253L8.11911 14.4484C7.6828 14.0935 7.11722 13.9388 6.56101 14.022C6.00479 14.1053 5.50934 14.4189 5.19609 14.886L3.33895 17.6553C2.72373 18.5726 2.96867 19.8151 3.88604 20.4303C4.42764 20.7935 5.08254 20.8569 5.65478 20.6591C7.58564 26.1055 12.8061 30 18.9286 30C26.6888 30 33 23.7432 33 16C33 8.25684 26.6888 2 18.9286 2Z"
                      fill="black"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M37 16C37 20.2866 35.5016 24.2232 33 27.3147V41H6L6 28.4499C4.23521 26.6077 2.85817 24.391 2 21.931V51C2 54.3137 4.68629 57 8 57H9.28988C10.1504 59.8915 12.829 62 16 62C19.171 62 21.8496 59.8915 22.7101 57L37.2899 57C38.1504 59.8915 40.829 62 44 62C47.171 62 49.8496 59.8915 50.7101 57H56C59.3137 57 62 54.3137 62 51V40.75C62 40.1183 61.7015 39.5237 61.195 39.1462L55.8835 35.1887C55.3125 34.7633 54.6743 34.4456 54 34.2463V28C55.1046 28 56 27.1046 56 26V25C56 20.0294 51.9706 16 47 16L37 16ZM50.7101 53H56C57.1046 53 58 52.1046 58 51V47H54C52.8954 47 52 46.1046 52 45C52 43.8954 52.8954 43 54 43H58V41.7539L53.4936 38.3962C53.1483 38.139 52.7292 38 52.2986 38H37V53H37.2899C38.1504 50.1085 40.829 48 44 48C47.171 48 49.8496 50.1085 50.7101 53ZM22.7101 53H33L33 45L6 45L6 51C6 52.1046 6.89543 53 8 53H9.28988C10.1504 50.1085 12.829 48 16 48C19.171 48 21.8496 50.1085 22.7101 53ZM37 20V24L51.9 24C51.4367 21.7178 49.419 20 47 20L37 20ZM37 28V34H50V28L37 28ZM13 55C13 53.3431 14.3431 52 16 52C17.6569 52 19 53.3431 19 55C19 56.6569 17.6569 58 16 58C14.3431 58 13 56.6569 13 55ZM41 55C41 53.3431 42.3431 52 44 52C45.6569 52 47 53.3431 47 55C47 56.6569 45.6569 58 44 58C42.3431 58 41 56.6569 41 55Z"
                      fill="black"
                    />
                  </svg>
                </div>
              </label>
            </div>
          ) : (
            <div className="flex w-20 h-10 mb-3 sm:mb-0">
              <label className="flex flex-col items-center justify-center w-44 border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-500 dark:hover:border-gray-500 dark:hover:bg-gray-500">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 text-fuchsia-200"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                </div>
                <input
                  accept=".csv"
                  onChange={async (e) => {
                    if (e.target.files) {
                      await handleFileUpload(e.target.files[0]);
                    }
                  }}
                  type="file"
                  className="hidden"
                />
              </label>
            </div>
          )
        ) : (
          <div className="flex w-20 h-10">
            <label className="flex flex-col items-center justify-center w-44 border-2 border-gray-300 rounded-lg bg-gray-500  dark:bg-gray-700 dark:border-gray-500">
              <div className="flex flex-col items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -2 24 30"
                  fill="rgb(225,0,225)"
                  x="0px"
                  y="0px"
                  height="60px"
                  width="45px"
                >
                  <path
                    d="M7.30001 11.8985H6.3751C5.04235 11.8985 4.00012 12.9494 4.00012 14.1993C4.00012 15.4491 5.04235 16.5 6.3751 16.5H17.0625C18.2636 16.5 19.3305 15.7928 19.7795 14.7328C20.2268 13.6767 19.9827 12.4578 19.1475 11.6411C18.6158 11.121 17.8694 10.8209 17.1216 10.7978L16.4952 10.7784L16.2396 10.2063C15.4383 8.4134 13.5304 7.3169 11.5109 7.52525C9.49269 7.73346 7.86626 9.19234 7.4664 11.1033L7.30001 11.8985ZM6.4876 10.8985C6.97916 8.54928 8.96997 6.78207 11.4083 6.53052C13.8466 6.27898 16.1706 7.60104 17.1525 9.79825C18.134 9.82862 19.124 10.2193 19.8467 10.9261C20.9729 12.0275 21.3097 13.6838 20.7003 15.1228C20.0908 16.5618 18.6551 17.5 17.0625 17.5H6.3751C4.51115 17.5 3.00012 16.0222 3.00012 14.1993C3.00012 12.3763 4.51115 10.8985 6.3751 10.8985H6.4876Z"
                    fill="#f0abfc"
                  />
                  <path
                    d="M14.8536 11.3535L11 15.2071L9.14648 13.3535L9.85359 12.6464L11 13.7929L14.1465 10.6464L14.8536 11.3535Z"
                    fill="#f0abfc"
                  />
                </svg>
              </div>
            </label>
          </div>
        )}
        <div className="flex gap-2 group fixed bottom-12">
          <div className="flex w-20 h-10 mb-3 sm:mb-0">
            <label
              onClick={() => router.push("/dashboard")}
              className="flex flex-col items-center justify-center w-44 border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-400 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-500 dark:hover:border-blue-300 dark:hover:bg-blue-500"
              title="Dashboard"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  height="50px"
                  width="50px"
                  viewBox="0 -20 100 125"
                >
                  <g>
                    <g>
                      <path d="M53.5,70c0.6,0,0.7-0.3,0.3-0.7L38.7,54.2c-0.4-0.4-0.3-0.7,0.3-0.7h34.6c0.6,0,1-0.4,1-1v-5    c0-0.6-0.4-1-1-1H39c-0.6,0-0.7-0.3-0.3-0.7l15.1-15.1c0.4-0.4,0.3-0.7-0.3-0.7h-7.9c-0.6,0-1.3,0.3-1.7,0.7L25.3,49.3    c-0.4,0.4-0.4,1,0,1.4l18.6,18.6c0.4,0.4,1.2,0.7,1.7,0.7H53.5z" />
                    </g>
                  </g>
                </svg>
              </div>
            </label>
          </div>

          <div
            onClick={() => (isFile ? setFloat(true) : null)}
            className="flex w-20 h-10 mb-3 sm:mb-0"
          >
            <label
              className={`flex flex-col items-center justify-center w-44 border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-500 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-500 ${
                isFile
                  ? "dark:hover:border-green-700 dark:hover:bg-green-500"
                  : `hover:bg-gray-500 dark:hover:border-gray-900`
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -40 200 250"
                  version="1.1"
                  height="45px"
                  width="45px"
                >
                  <g stroke="none" fill="none">
                    <g fill="#000000">
                      <path d="M119,112.089933 C116.989132,114.473723 115.300127,117.137881 113.999995,120.015398 L114,67 C114,64.790861 112.209139,63 110,63 L91,63 C88.790861,63 87,64.790861 87,67 L87,146 C87,148.209139 88.790861,150 91,150 L110,150 C111.71395,150 113.176123,148.922017 113.745511,147.407059 C114.5437,149.265343 115.50277,151.038183 116.605192,152.708052 C115.161743,154.125651 113.182979,155 111,155 L90,155 C85.581722,155 82,151.418278 82,147 L82,66 C82,61.581722 85.581722,58 90,58 L111,58 C115.418278,58 119,61.581722 119,66 L119,112.089933 Z M165,106.501595 C163.429698,105.357527 161.777058,104.344695 160.000003,103.479222 L160,49 C160,46.790861 158.209139,45 156,45 L137,45 C134.790861,45 133,46.790861 133,49 L133,102.178215 C131.26092,102.834353 129.589768,103.628963 127.999991,104.5486 L128,48 C128,43.581722 131.581722,40 136,40 L157,40 C161.418278,40 165,43.581722 165,48 L165,106.501595 Z M44,75 L65,75 C69.418278,75 73,78.581722 73,83 L73,147 C73,151.418278 69.418278,155 65,155 L44,155 C39.581722,155 36,151.418278 36,147 L36,83 C36,78.581722 39.581722,75 44,75 Z M45,80 C42.790861,80 41,81.790861 41,84 L41,146 C41,148.209139 42.790861,150 45,150 L64,150 C66.209139,150 68,148.209139 68,146 L68,84 C68,81.790861 66.209139,80 64,80 L45,80 Z" />
                      <path d="M144.5,170 C124.341607,170 108,153.658393 108,133.5 C108,113.341607 124.341607,97 144.5,97 C164.658393,97 181,113.341607 181,133.5 C181,153.658393 164.658393,170 144.5,170 Z M144.5,165 C161.89697,165 176,150.89697 176,133.5 C176,116.10303 161.89697,102 144.5,102 C127.10303,102 113,116.10303 113,133.5 C113,150.89697 127.10303,165 144.5,165 Z" />
                      <rect x="142" y="113" width="5" height="42" rx="2.5" />
                      <rect
                        transform="translate(144.500000, 134.000000) rotate(90.000000) translate(-144.500000, -134.000000) "
                        x="142"
                        y="113"
                        width="5"
                        height="42"
                        rx="2.5"
                      />
                    </g>
                  </g>
                </svg>
              </div>
            </label>
          </div>

          <div className="flex w-20 h-10 mb-3 sm:mb-0">
            <label
              onClick={() => setDel(true)}
              className="flex flex-col items-center justify-center w-44 border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-400 dark:hover:border-red-700 dark:hover:bg-red-400"
              title="Delete Project"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  height="40px"
                  width="40px"
                  viewBox="-5.0 -20 110.0 135.0"
                >
                  <path d="m40.012 45.426c-0.55859-0.60938-0.51953-1.5586 0.089843-2.1172 0.60938-0.55859 1.5586-0.51953 2.1172 0.089844l10.43 11.309 10.426-11.309c0.55859-0.60938 1.5078-0.64844 2.1172-0.089844s0.64844 1.5078 0.089844 2.1172l-11.617 12.59c-0.60937 0.55859-1.5586 0.51953-2.1172-0.089844l-11.531-12.504zm29.133 3.8711c0.60938-0.55859 1.5586-0.51953 2.1172 0.089844 0.55859 0.60938 0.51953 1.5586-0.089844 2.1172l-11.309 10.43 11.309 10.426c0.60938 0.55859 0.64844 1.5078 0.089844 2.1172-0.55859 0.60938-1.5078 0.64844-2.1172 0.089844l-12.59-11.617c-0.55859-0.60938-0.51953-1.5586 0.089843-2.1172l12.504-11.531zm-3.8711 29.133c0.55859 0.60937 0.51953 1.5586-0.089844 2.1172s-1.5586 0.51953-2.1172-0.089844l-10.426-11.309-10.43 11.309c-0.55859 0.60938-1.5078 0.64844-2.1172 0.089844s-0.64844-1.5078-0.089844-2.1172l11.617-12.59c0.60938-0.55859 1.5586-0.51953 2.1172 0.089844l11.527 12.504zm-29.133-3.8711c-0.60938 0.55859-1.5586 0.51953-2.1172-0.089844-0.55859-0.60938-0.51953-1.5586 0.089843-2.1172l11.309-10.426-11.309-10.43c-0.60938-0.55859-0.64844-1.5078-0.089843-2.1172 0.55859-0.60938 1.5078-0.64844 2.1172-0.089844l12.59 11.617c0.55859 0.60938 0.51953 1.5586-0.089844 2.1172l-12.504 11.527zm21.219-63.426-0.98438-6.5273-16.707 2.5195 0.98438 6.5273zm21.922-0.27344-59.656 8.9961 1.0898 7.2383 59.66-8.9961zm-1.2109 17.602h-50.855l3.4453 60.02c0.10938 1.9414 0.97266 3.6719 2.2852 4.9141 1.3164 1.2422 3.0977 2 5.0508 2h29.289c1.9531 0 3.7305-0.75781 5.0469-2 1.3164-1.2422 2.1758-2.9727 2.2852-4.9141l3.4492-60.02z" />
                </svg>
              </div>
            </label>
          </div>
        </div>
      </div>

      {isFile ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pb-9">
          {loading ? (
            <div className="flex items-center justify-center col-span-2 space-x-2 h-full bg-gray-900 pt-20">
              <div className="w-4 h-4 bg-violet-600 dark:bg-violet-400 rounded-full animate-pulse"></div>
              <div className="w-4 h-4 bg-violet-600 dark:bg-violet-400 rounded-full animate-pulse"></div>
              <div className="w-4 h-4 bg-violet-600 dark:bg-violet-400 rounded-full animate-pulse"></div>
            </div>
          ) : (
            <PlotsRenderer />
          )}
        </div>
      ) : uploading ? (
        <div className="flex justify-center text-gray-300">Uploading...</div>
      ) : (
        <div className="flex justify-center text-gray-300">
          Select a file to begin
        </div>
      )}

      {float ? (
        <div className="fixed inset-0 bg-gray-700 h-screen flex items-center justify-center bg-opacity-45 backdrop-blur-sm">
          <NewPlot
            projectId={id}
            setFloat={setFloat}
            plots={plots}
            setPlots={setPlots}
            options={processedData}
          />
        </div>
      ) : null}
      {del ? (
        <div className="fixed inset-0 bg-gray-700 h-screen flex items-center justify-center bg-opacity-45 backdrop-blur-sm">
          <Delete setFloat={setDel} id={id} />
        </div>
      ) : null}
    </div>
  );
}
