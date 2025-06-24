import axios from "axios";
import { ChartColumnBig, LogOut, Menu, User, X } from "lucide-react";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { LiaCommentSolid } from "react-icons/lia";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "../components/ui/avatar";
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
import { setUser } from "../redux/authSlice";

const menuItems = [
  { name: "Home", to: "/" },
  { name: "Blogs", to: "/blogs" },
  { name: "Contact", to: "/contact" },
  { name: "About", to: "/about" },
];

const Header = () => {
  const [menuState, setMenuState] = useState(false);
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
  // Access user object directly from the Redux state
  const user = useSelector((state) => state.auth.user);
  console.log(user); // This will help debug the user object
  const imgPath = import.meta.env.VITE_SERVER_URL;

  return (
    <>
      <header>
        <nav
          data-state={menuState && "active"}
          className="fixed z-20 w-full border-b border-dashed bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent"
        >
          <div className="m-auto max-w-5xl px-6">
            <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
              <div className="flex w-full justify-between lg:w-auto">
                <Link
                  href="/"
                  aria-label="home"
                  className="flex items-center space-x-2"
                >
                  Kotha
                </Link>

                <button
                  onClick={() => setMenuState(!menuState)}
                  aria-label={menuState === true ? "Close Menu" : "Open Menu"}
                  className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                >
                  <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                  <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                </button>
              </div>

              <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                <div className="lg:pr-4">
                  <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          to={item.to}
                          className="text-muted-foreground hover:text-accent-foreground block duration-150"
                        >
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {!user?.user || Object.keys(user).length === 0 ? (
                  <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6">
                    <Button asChild variant="outline" size="sm">
                      <Link to={"/login"}>
                        <span>Login</span>
                      </Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link to={"/register"}>
                        <span>Register</span>
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6">
                    <DropdownMenu className="">
                      <DropdownMenuTrigger asChild>
                        <Avatar>
                          <AvatarImage
                            src={
                              user?.user?.image
                                ? `${imgPath}/images/${user.user.image}`
                                : `${imgPath}/defaultImage.png`
                            }
                            alt={user?.user?.name || "User"}
                          />
                        </Avatar>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 dark:bg-gray-800">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(`/dashboard/profile/${user?.user?._id}`)
                            }
                          >
                            <User />
                            <span>Profile</span>
                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/dashboard/your-blog`)}
                          >
                            <ChartColumnBig />
                            <span>Your Blog</span>
                            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/dashboard/comments`)}
                          >
                            <LiaCommentSolid />
                            <span>Comments</span>
                            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/dashboard/write-blog`)}
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
