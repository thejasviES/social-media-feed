import { EditProfile } from "../components/EditProfile";

import { useUser } from "../queries/useUser";

export default function EditProfilePage() {
  const { isLoading, user } = useUser();
  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen">
      <EditProfile userID={user?.id} />
    </div>
  );
}
