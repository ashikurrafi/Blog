import {
  ChartColumnBig,
  ChevronFirst,
  ChevronLast,
  LogOut,
  MoreVertical,
  SquareUser,
  User,
} from "lucide-react";
import { createContext, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { LiaCommentSolid } from "react-icons/lia";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

// Dropdown components (make sure these exist in your setup)
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "../redux/authSlice";

const SidebarContext = createContext();

const Sidebar = () => {



  const imgPath = import.meta.env.VITE_SERVER_URL;


  const [expanded, setExpanded] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      const response = await axios.post(`/api/v1/demo/auth/logoutUser`, {
        withCredentials: true,
      });
      console.log(response);
      if (response.data.success) {
        navigate("/");
        dispatch(setUser(null));
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  return (
    <>
      {/* <aside className="h-screen"> */}
      <aside>
        <nav className="h-full flex flex-col bg-white border-r shadow-sm">
          {/* Header */}
          <div className="p-4 pb-2 flex justify-between items-center">
            <img
              src="https://img.logoipsum.com/243.svg"
              className={`overflow-hidden transition-all ${
                expanded ? "w-32" : "w-0"
              }`}
              alt="Logo"
            />
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>

          {/* Navigation */}
          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3 space-y-2 text-lg font-semibold">
              <NavLink
                to={`/dashboard/profile/${user?.user?._id}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-md transition-all ${
                    isActive ? "bg-gray-200 text-gray-900" : "text-gray-700"
                  } hover:bg-gray-100`
                }
              >
                <SquareUser />
                {expanded && <span>Profile</span>}
              </NavLink>

              <NavLink
                to="/dashboard/your-blog"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-md transition-all ${
                    isActive ? "bg-gray-200 text-gray-900" : "text-gray-700"
                  } hover:bg-gray-100`
                }
              >
                <ChartColumnBig />
                {expanded && <span>Your Blogs</span>}
              </NavLink>

              <NavLink
                to="/dashboard/comments"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-md transition-all ${
                    isActive ? "bg-gray-200 text-gray-900" : "text-gray-700"
                  } hover:bg-gray-100`
                }
              >
                <LiaCommentSolid size={24} />
                {expanded && <span>Comments</span>}
              </NavLink>

              <NavLink
                to="/dashboard/write-blog"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-md transition-all ${
                    isActive ? "bg-gray-200 text-gray-900" : "text-gray-700"
                  } hover:bg-gray-100`
                }
              >
                <FaRegEdit />
                {expanded && <span>Create Blog</span>}
              </NavLink>
            </ul>
          </SidebarContext.Provider>

          {/* Footer with user info and dropdown */}
          <div className="border-t flex items-center p-3">
            <img
                         src={`${imgPath}/images/${user?.user?.image}`}

              alt={user?.user?.name || "User"}
              className="w-10 h-10 rounded-md object-cover"
            />
            <div
              className={`overflow-hidden transition-all ${
                expanded ? "w-52 ml-3" : "w-0"
              }`}
            >
              <div className="leading-4">
                <h4 className="font-semibold">{user?.user?.name || "User"}</h4>
                <span className="text-xs text-gray-600">
                  {user?.user?.email || "user@user.com"}
                </span>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-auto p-1 hover:bg-gray-100 rounded">
                  <MoreVertical size={20} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mr-3 dark:bg-gray-800">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() =>
                      navigate(`/dashboard/profile/${user?.user?._id}`)
                    }
                  >
                    <User className="mr-2" />
                    <span>Profile</span>
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard/your-blog")}
                  >
                    <ChartColumnBig className="mr-2" />
                    <span>Your Blog</span>
                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard/comments")}
                  >
                    <LiaCommentSolid className="mr-2" />
                    <span>Comments</span>
                    <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard/write-blog")}
                  >
                    <FaRegEdit className="mr-2" />
                    <span>Write Blog</span>
                    <DropdownMenuShortcut>⌘W</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logoutHandler}>
                  <LogOut className="mr-2" />
                  <span>Log out</span>
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
