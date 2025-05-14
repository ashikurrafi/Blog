import { Search } from "lucide-react";
import { FaMoon } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import Logo from "../assets/logo.png";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const Navbar = () => {
  const user = false;

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
              <Button className="">
                <FaMoon />
              </Button>
              {user ? (
                <div></div>
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
