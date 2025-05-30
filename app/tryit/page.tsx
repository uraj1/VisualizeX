import Header from "@/components/RouteHeader"
import Link from 'next/link'


export default function Home() {
  return (
    <main className="flex flex-col bg-gray-900 h-screen">
      {Header("", null)}
      <div className="mt-40 mx-12 flex items-center">
        <div className="w-full flex flex-col items-center">
        <h2 className="text-white text-xl">☹️We regret to inform you that the trial period for accessing our features has concluded.</h2>
        <h2 className="text-white text-xl">To continue enjoying our services, please consider <Link href="/signup"><span className="hover:underline cursor-pointer text-blue-500">signing up</span></Link>  for an account.</h2>
        </div>
      </div>
    </main>
  );
}
