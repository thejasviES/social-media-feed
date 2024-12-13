
import { Link } from "react-router-dom";

const CreatePostButton = () => {
  return (
    <Link
      to="/post/create"
      className="sticky bottom-[30px] left-full bg-black text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-colors"
      aria-label="Create new post"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    </Link>
  );
};

export default CreatePostButton;
