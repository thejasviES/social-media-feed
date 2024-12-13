import { EditProfile } from "../components/EditProfile";

import { useUser } from "../queries/useUser";
import Loading from "../components/Loading";

export default function EditProfilePage() {
  const { isLoading, user } = useUser();
  if (isLoading) return <Loading />;
  if (!isLoading && !user?.id) return <div>User not found</div>;
  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen">
      <EditProfile userID={user!.id} />
    </div>
  );
}
