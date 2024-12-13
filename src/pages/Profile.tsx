import CreatePostButton from "../components/CreatePostButton";
import { ProfileComponent } from "../components/ProflieComponent";
import { useUser } from "../queries/useUser";
import Loading from "../components/Loading";

const Profile = () => {
  const { isLoading, user } = useUser();

  if (isLoading) return <Loading />;
  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen">
      <ProfileComponent userId={user?.id || ""} />
      <CreatePostButton />
    </div>
  );
};

export default Profile;
