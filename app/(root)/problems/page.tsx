import { getCurrentUserData } from "@/modules/auth/actions";
import { getAllProblems } from "@/modules/problems/actions";
import ProblemsTable from "@/modules/problems/components/problems-table";

export const dynamic = "force-dynamic";

const ProblemsPage = async () => {
  const [userData, { data: problems, error }] = await Promise.all([
    getCurrentUserData(),
    getAllProblems(),
  ]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-destructive">
          Error loading problems: {error}
        </p>
      </div>
    );
  }

  // Exclude the error result returned by getCurrentUserData().
  const user =
    userData && !("error" in userData)
      ? {
          id: userData.id,
          role: userData.role,
        }
      : null;

  return (
    <div className="container mx-auto py-32">
      <ProblemsTable problems={problems ?? []} user={user} />
    </div>
  );
};

export default ProblemsPage;