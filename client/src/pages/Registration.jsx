import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import regImg from "../assets/register.png";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const Registration = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleChange = (eve) => {
    const { name, value } = eve.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (eve) => {
    eve.preventDefault();
    console.log("User data being sent:", user); // Log data

    try {
      const response = await axios.post(
        `/api/v1/demo/auth/registerUser`,
        user,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("Response:", response.data); // Log the response to see if it's success or failure
      if (response.data.success) {
        navigate("/verifyOTP");
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error occurred:", error); // Log detailed error info
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="flex  h-screen md:pt-14 md:h-[760px] ">
        <div className="hidden md:block">
          <img src={regImg} alt="" className="w-[750px] pt-15" />
        </div>
        <div className="pt-6 justify-center items-center flex-1 px-4 md:px-0 mt-15">
          <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl dark:bg-gray-800 dark:border-gray-600">
            <CardHeader>
              <CardTitle>
                <h1 className="text-center text-xl font-semibold">
                  Create an account
                </h1>
              </CardTitle>
              <p className=" mt-2 text-sm font-serif text-center dark:text-gray-300">
                Enter your details below to create your account
              </p>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="email">Name</Label>
                  <Input
                    type="txt"
                    name="name"
                    placeholder="Name"
                    value={user.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="email">Phone number</Label>
                  <Input
                    type="txt"
                    name="phone"
                    placeholder="+880XXXXXXXXXX"
                    value={user.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={user.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="relative">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="email">Password</Label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={user.password}
                      onChange={handleChange}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-7 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
                <p className="text-center text-gray-600 dark:text-gray-300">
                  Already have an account? &nbsp;
                  <Link to={"/login"}>
                    <span className="underline cursor-pointer hover:text-gray-800 dark:hover:text-gray-100">
                      Sign in
                    </span>
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Registration;
