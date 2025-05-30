'use client'
import Header from "@/components/RouteHeader"
import { useSession } from "next-auth/react"

export default function Page(){
    const { data: session } = useSession()
    return <div className="bg-gray-900 h-screen">
        {Header("/ docs", session)}
    </div>
}