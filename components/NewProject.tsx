import { useRef } from "react";
import { addProject } from "@/app/actions/user";

interface Props {
  float: boolean;
  setFloat: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NewProject(props: Props) {
  const nameRef = useRef("")
  const descRef = useRef("")
  return (
    <div className="w-96 h-96 rounded-xl bg-gray-800 flex flex-col p-8">
      <h2 className="text-white text-lg font-semibold text-center pb-4">
        Create a new project
      </h2>
      <h2 className="text-white text-sm mb-2">Name</h2>
      <input
        onChange={(e) =>nameRef.current = e.target.value}
        className="bg-gray-700 p-2 rounded-lg text-gray-300"
        type="text"
        maxLength={30}
      />
      <h2 className="text-white text-sm mb-2 mt-3">Description</h2>
      <textarea
        maxLength={100}
        onChange={(e) =>descRef.current = e.target.value}
        rows={3}
        className="bg-gray-700 p-2 rounded-lg text-gray-300 mb-10"
      />
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => props.setFloat(!props.float)}
          className="p-2 bg-red-600 text-white text-md rounded-md hover:bg-red-500 transition-colors duration-300"
        >
          Cancel
        </button>
        <button onClick={async () => { if(nameRef.current){
          props.setFloat(false)
             await addProject(nameRef.current, descRef.current)
             
        }
        }} className="p-2 bg-blue-700 text-white text-md rounded-md hover:bg-blue-600 transition-colors duration-300">
          Create
        </button>
      </div>
    </div>
  );
}
