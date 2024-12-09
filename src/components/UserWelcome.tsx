import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useUserProfile } from "../hooks/useUserProfile";

const UserWelcome = ({ userId }: { userId: string }) => {
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useUserProfile(userId);

  //   useEffect(() => {

  //     if (profile) {
  //       const userData = {
  //         name: profile.data.full_name || "",
  //         bio: profile.data.bio || "",
  //         avatar_url: profile.data.avatar_url || "",
  //         banner_url: profile.data.banner_url || "",
  //       };

  //     }
  //   }, [profile]);
  if (profileLoading) return <div>Loading...</div>;
  return (
    <div className="flex items-center gap-4 mb-8">
      <Avatar
        className="h-16 w-16 border-2 border-white shadow-lg hover:cursor-pointer"
        onClick={() => navigate("/profile")}
      >
        <AvatarImage src={profile?.data.avatar_url || ""} alt="User avatar" />
        <AvatarFallback>{profile?.data.full_name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <div className="text-sm text-muted-foreground">Welcome Back,</div>
        <h1 className="text-2xl font-semibold">{profile?.data.full_name}</h1>
      </div>
    </div>
  );
};

export default UserWelcome;
