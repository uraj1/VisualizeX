import { deleteProject } from "@/app/actions/user";
import { useRouter } from "next/navigation";

export default function Delete({
  setFloat, id
}: {
  setFloat: React.Dispatch<React.SetStateAction<boolean>>;
  id: string
}) {
    const router = useRouter()
  return (
    <div className="w-96 h-32 rounded-xl bg-gray-800 flex flex-col px-8 pt-4">
      <h2 className="text-white text-lg font-semibold text-center pb-4">
        Delete this project?
        <h2 className="text-xs text-red-600">
          Note: This action is irreversible
        </h2>
      </h2>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setFloat(false)}
          className="p-2 bg-blue-700 text-white text-md rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            await deleteProject(id)
            setFloat(false);
            router.push("/dashboard")
          }}
          className=" p-2 bg-red-600 text-white text-md rounded-md hover:bg-red-500 transition-colors duration-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
