import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/lib/useAuth";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "@/components/data-table/columns";
// import { problems } from "@/components/data-table/types"; // or from Firebase later

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); 
  // const user = "abc123";
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axios.get(`/api/problems`, {
          baseURL: "http://localhost:8000",
          params: {
            user_id: user.uid,
            sort_by: "date_solved",
            order: "desc",
          },
        });
        setProblems(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoading(false);
      }
    };
  
    if (user?.uid) {
      fetchProblems();
    }
  }, [user]);
  return (
    <div className="p-6 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-lg shadow-sm">
    {/* <h2 className="text-2xl font-semibold text-center mb-6">
      🧠 All Problems
    </h2> */}
    <DataTable data={problems} columns={columns} />
  </div>
  );
}
  