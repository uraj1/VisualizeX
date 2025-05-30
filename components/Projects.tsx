import { useEffect, useState } from "react";
import NewProject from "./NewProject";
import Link from "next/link";
import { getProjects } from "@/app/actions/user";

export type projectProps = {
  id: string;
  name: string;
  Description: string | null;
  createdAt: Date;
  csv: string | null;
  authorId: number;
};

export default function Projects() {
  const [projects, setProjects] = useState<projectProps[]>([]);
  const [float, setFloat] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const allProjects = await getProjects();
      allProjects ? setProjects(allProjects) : null;
      setLoading(false);
    }
    init();
  }, [float]);
  console.log(loading);

  const allProjects = (projects: projectProps[]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-6 sm:pl-3 pl-0">
        {projects.map((p) => {
          return (
            <div key={p.id}>
              <Link href={`/workspace/${p.id}`}>
                <div className="flex justify-center items-end bg-gradient-to-tr from-pink-400 to-cyan-400 rounded-md h-36 w-60 cursor-pointer opacity-75 hover:opacity-100 transition-opacity duration-300">
                  <div className="flex justify-between w-full px-3 pb-1">
                    <h2 className="text-xs text-white">{p.name}</h2>
                    <h2 className="text-xs text-white">
                      Created on: {p.createdAt.toString().slice(4, 10)}
                    </h2>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
        <div
          onClick={() => setFloat(true)}
          className="flex justify-center items-center bg-gray-600 rounded-md h-36 w-60 cursor-pointer hover:bg-gray-700 transition-colors duration-300"
        >
          <p className="text-center text-white text-3xl">+</p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900">
      <div className="mb-6">
        <h2 className="text-white text-lg border-b-fuchsia-400 border-b-2 pb-4 font-bold">
          My Workspaces
        </h2>
      </div>
      {loading ? (
        <div className="flex items-center justify-center space-x-2 h-full bg-gray-900 pt-20">
          <div className="w-4 h-4 bg-violet-600 dark:bg-violet-400 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-violet-600 dark:bg-violet-400 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-violet-600 dark:bg-violet-400 rounded-full animate-pulse"></div>
        </div>
      ) : (
        allProjects(projects)
      )}
      {float ? (
        <div className="fixed inset-0 bg-gray-700 h-screen flex items-center justify-center bg-opacity-45 backdrop-blur-sm">
          <NewProject setFloat={setFloat} float={float} />
        </div>
      ) : null}
    </div>
  );
}
