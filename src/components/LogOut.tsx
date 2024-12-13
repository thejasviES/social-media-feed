import { useNavigate } from "react-router-dom";
import { logout } from "../services/apiAuth";
import { LogOut as LogOutIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const LogOutButton = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout();
    queryClient.clear();
    queryClient.resetQueries();
    navigate("/signin");
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <LogOutIcon
          className="h-6 w-6 hover:cursor-pointer "
          onClick={handleLogout}
        />
      </div>
    </>
  );
};

export { LogOutButton };
export default LogOutButton;
