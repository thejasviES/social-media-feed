import { ProfileComponent } from "../components/ProflieComponent";
import { useUser } from "../queries/useUser";
import { useAuthStore } from "../store/authStore";

const Profile = () => {
  const { isLoading, user } = useUser();

  if (isLoading) return <div>Loading...</div>;
  console.log("ppppuser", user);
  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen">
      <ProfileComponent userId={user?.id || ""} />
    </div>
  );
};

export default Profile;
