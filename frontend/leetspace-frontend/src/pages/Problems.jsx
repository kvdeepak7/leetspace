import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/lib/useAuth";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "@/components/data-table/columns";
import { EditProblemDialog } from "@/components/EditProblemDialog";
import { DeleteProblemDialog } from "@/components/DeleteProblemDialog";
import { toast } from "sonner";
// import { problems } from "@/components/data-table/types"; // or from Firebase later

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const { user } = useAuth(); 
  // const user = "abc123";

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

  useEffect(() => {
    if (user?.uid) {
      fetchProblems();
    }
  }, [user]);

  const handleEdit = (problem) => {
    setSelectedProblem(problem);
    setEditDialogOpen(true);
  };

  const handleDelete = (problem) => {
    setSelectedProblem(problem);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async (problemId) => {
    try {
      await axios.delete(`/api/problems/${problemId}`, {
        baseURL: "http://localhost:8000",
      });
      
      // Remove the problem from the local state
      setProblems(problems.filter(p => p.id !== problemId));
      toast.success("Problem deleted successfully!");
    } catch (error) {
      console.error("Error deleting problem:", error);
      toast.error("Failed to delete problem. Please try again.");
    }
  };

  const updateProblem = async (problemId, updateData) => {
    try {
      await axios.put(
        `/api/problems/${problemId}`,
        updateData,
        {
          baseURL: "http://localhost:8000",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      // Refresh the problems list
      await fetchProblems();
      toast.success("Problem updated successfully!");
    } catch (error) {
      console.error("Error updating problem:", error);
      toast.error("Failed to update problem. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-lg shadow-sm">
        <div className="text-center">Loading problems...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-lg shadow-sm">
    {/* <h2 className="text-2xl font-semibold text-center mb-6">
      🧠 All Problems
    </h2> */}
    <DataTable data={problems} columns={columns(handleEdit, handleDelete)} />
    
    <EditProblemDialog
      problem={selectedProblem}
      open={editDialogOpen}
      onOpenChange={setEditDialogOpen}
      onSave={updateProblem}
    />

    <DeleteProblemDialog
      problem={selectedProblem}
      open={deleteDialogOpen}
      onOpenChange={setDeleteDialogOpen}
      onConfirm={confirmDelete}
    />
  </div>
  );
}
  