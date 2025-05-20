import axios from "axios";
import { ChartColumnBig, LogOut, Search, User } from "lucide-react";
// import {  Cog } from "lucide-react";
import { FaMoon, FaRegEdit, FaSun } from "react-icons/fa";
import { LiaCommentSolid } from "react-icons/lia";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Logo from "../assets/logo.png";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Input } from "../components/ui/input";
import { setUser } from "../redux/authSlice";
import { toggleTheme } from "../redux/themeSlice";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const { theme } = useSelector((store) => store.theme);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const response = await axios.post(`/api/v1/demo/auth/logoutUser`, null, {
        withCredentials: true,
      });
      if (response.data.success) {
        navigate("/");
        dispatch(setUser(null));
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="py-2 fixed w-full dark:bg-gray-800 dark:border-b-gray-600 border-b-gray-300 border-2 bg-white z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-0">
          {/* logo section */}
          <div className="flex gap-7 items-center">
            <Link to={"/"}>
              <div className="flex gap-2 items-center">
                <img src={Logo} alt="Logo" className="w-30 dark:invert" />
              </div>
            </Link>
            <div className="relative hidden md:block">
              <Input
                type="text"
                placeholder="Search here ..."
                className="border border-gray-700 dark:bg-gray-900 bg-gray-300 w-[300px] hidden md:block"
              />
              <Button className="absolute top-0 left-76">
                <Search />
              </Button>
            </div>
          </div>
          {/* nav section */}
          <nav className="flex md:gap-7 gap-4 items-center">
            <ul className="hidden md:flex gap-7 items-center text-xl font-semibold">
              <NavLink to={"/"} className="cursor-pointer">
                <li>Home</li>
              </NavLink>
              <NavLink to={"/blogs"} className={`cursor-pointer`}>
                <li>Blogs</li>
              </NavLink>
              <NavLink to={"/about"} className={`cursor-pointer`}>
                <li>About</li>
              </NavLink>
            </ul>
            <div className="flex">
              <Button onClick={() => dispatch(toggleTheme())}>
                {theme === "light" ? <FaMoon /> : <FaSun />}
              </Button>
              {user ? (
                <div className="ml-7 flex gap-3 items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="cursor-pointer">
                        <AvatarImage src={user.profileImage} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 dark:bg-gray-800">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() => navigate("/dashboard/profile")}
                        >
                          <User />
                          <span>Profile</span>
                          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate("/dashboard/your-blog")}
                        >
                          <ChartColumnBig />
                          <span>Your Blog</span>
                          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem>
                          <Cog />
                          <span>Settings</span>
                          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </DropdownMenuItem> */}
                        <DropdownMenuItem
                          onClick={() => navigate("/dashboard/comments")}
                        >
                          <LiaCommentSolid />
                          <span>Comments</span>
                          <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => navigate("/dashboard/write-blog")}
                        >
                          <FaRegEdit />
                          <span>Write Blog</span>
                          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem onClick={logoutHandler}>
                        <LogOut />
                        <span>Log out</span>
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button onClick={logoutHandler}>Logout</Button>
                </div>
              ) : (
                <div className="ml-7 md:flex gap-2 ">
                  <Link to={"/login"}>
                    <Button>Login</Button>
                  </Link>
                  <Link className="hidden md:block" to={"/signup"}>
                    <Button>Signup</Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
