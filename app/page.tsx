import Header from "@/components/RouteHeader"
import Hero from "@/components/Hero";
import Herobuttons from "@/components/Herobuttons";
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions)
  if(session){
    redirect("/dashboard")
  }
  return (
    <main className="flex flex-col bg-gray-900 h-screen w-screen overflow-y-hidden overflow-x-clip">
      {Header("", null)}
      <div className="mt-40 mx-12 flex flex-col items-center gap-10">
        <Hero />
        <Herobuttons />
      </div>
    </main>
  );
}
