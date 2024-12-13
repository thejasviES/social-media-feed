import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useUserProfile } from "../hooks/useUserProfile";
import { LogOutButton } from "./LogOut";
import { Spinner } from "./spinner";

const UserWelcome = ({ userId }: { userId: string }) => {
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useUserProfile(userId);

  if (profileLoading) return <Spinner />;
  return (
    <div className="flex justify-between gap-4 ">
      <div className="flex items-center gap-4 bg-white ">
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
      <LogOutButton />
    </div>
  );
};

export default UserWelcome;
