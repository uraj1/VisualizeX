'use client'
import Workspace from "@/components/Workspace";
import Header from "@/components/RouteHeader"
import { useSession } from "next-auth/react"
import { getProjectDetails } from "@/app/actions/user";
import { useEffect, useState } from "react";

export default function Page({
  params,
}: {
  params: {
    name: string;
  };
}) {
  const { data: session } = useSession()
  const [name, setName] = useState<string>("")
  useEffect(() => {
    async function init(){
      const name = await getProjectDetails(params.name)
      setName(name?.name as string)
    }
    init()
  }, [])
  return <div className="bg-gray-900 h-screen overflow-y-auto">
    {Header(`/ Dashboard / ${name}`, session)}
    <div className="px-10 2xl:px-40 py-20">
      <Workspace id={params.name}/>
    </div>
  </div>;
}
