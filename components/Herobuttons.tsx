import Link from 'next/link'

export default function Herobuttons(){
    return <div className="sm:flex gap-5 grid grid-rows-2">
        <Link href="/tryit">
            <button className="text-black p-3 w-32 rounded-xl bg-gray-300 text-md hover:bg-gray-400 transition-colors duration-300">Try it &rarr;</button>
        </Link>
        <Link href="/signup">
            <button className=" text-gray-100 p-3 w-32 rounded-xl bg-gradient-to-r from-red-500 to-indigo-600 text-md hover:bg-gradient-to-r hover:from-red-400 hover:to-indigo-700">Sign Up</button>
        </Link>
    </div>
}