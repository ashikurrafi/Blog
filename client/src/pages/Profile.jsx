import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

const Profile = () => {
  const { userId } = useParams();

  const baseUrl = import.meta.env.VITE_SERVER_URL;
  
  console.log(userId);
  const { user } = useSelector((store) => store.auth);
  
  console.log("Current user state:", user);
  console.log("Base URL:", `${baseUrl}/images/${user.profileImage}`);

  return (
    <>
      <div className="pt-20 md:ml-[320px] md:h-screen">
        <div className="max-w-6xl mx-auto mt-8 ">
          <Card className=" flex md:flex-row flex-col gap-10 p-6 md:p-10 dark:bg-gray-800 mx-4 md:mx-0">
            {/* image section */}
            <div className="flex flex-col items-center justify-center md:w-[400px]">
              <Avatar className="w-40 h-40 border-2">
                {/* <AvatarImage src={user?.profileImage} /> */}
                <AvatarImage src={`${baseUrl}/images/${user.profileImage}`} />
              </Avatar>

              <h1 className="text-center font-semibold text-xl text-gray-700 dark:text-gray-300 my-3">
                {"Mern Stack Developer"}
              </h1>
              <div className="flex gap-4 items-center">
                <Link>
                  <FaFacebook className="w-6 h-6 text-gray-800 dark:text-gray-300" />
                </Link>
                <Link target="_blank">
                  <FaLinkedin className="w-6 h-6 dark:text-gray-300 text-gray-800" />
                </Link>
                <Link target="_blank">
                  <FaGithub className="w-6 h-6 dark:text-gray-300 text-gray-800" />
                </Link>
                <Link>
                  <FaInstagram className="w-6 h-6 text-gray-800 dark:text-gray-300" />
                </Link>
              </div>
            </div>

            <div>
              <h1 className="font-bold text-center md:text-start text-4xl mb-7">
                Welcome {user?.name}
              </h1>
              <p className="">
                <span className="font-semibold">Email : {user?.email}</span>
              </p>
              <div className="flex flex-col gap-2 items-start justify-start my-5">
                <Label className="">About Me</Label>
                <p className="border dark:border-gray-600 p-6  rounded-lg">
                  {
                    "I'm a passionate web developer and content creator focused on frontend technologies. When I'm not coding, you can find me writing about tech, hiking, or experimenting with new recipes."
                  }
                </p>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button>Edit Profile</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you're
                      done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter name"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        placeholder="Enter a description"
                        className="col-span-3 text-gray-500"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="name" className="text-right">
                      Profile picture
                    </Label>
                    <Input
                      id="file"
                      type="file"
                      accept="image/*"
                      className="w-[277px]"
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Profile;
