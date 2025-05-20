import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import otpImg from "../assets/otp.png";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../components/ui/input-otp";
import { Label } from "../components/ui/label"; // ✅ Make sure this is correctly imported

const OTPverification = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const onComplete = async () => {
    try {
      if (otp.length !== 5) {
        toast.error("Please enter the complete 5-digit OTP.");
        return;
      }

      if (!email) {
        toast.error("Email is required.");
        return;
      }

      const response = await axios.post(`/api/v1/demo/auth/verifyOTP`, {
        otp,
        email,
      });

      if (response.data.success) {
        toast.success("OTP verified successfully!");
        navigate("/"); // ✅ Redirect on success
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      toast.error("Verification failed. Please try again later.");
      console.error("OTP verification error:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <div className="flex h-screen md:pt-14 md:h-[760px]">
      <div className="hidden md:block">
        <img src={otpImg} alt="OTP Illustration" className="w-[750px] pt-15" />
      </div>
      <div className="pt-28 justify-center items-center flex-1 px-3 md:px-0 mt-15 md:ml-20">
        <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl dark:bg-gray-800 dark:border-gray-600">
          <CardHeader>
            <CardTitle>
              <h1 className="text-center text-xl font-semibold">
                OTP Verification
              </h1>
            </CardTitle>
            <p className="mt-2 text-sm font-serif text-center dark:text-gray-300">
              Enter the OTP sent to your email
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Label className="items-center justify-center">OTP</Label>
              <div className="flex justify-center items-center">
                <InputOTP
                  maxLength={5}
                  value={otp}
                  onChange={(val) => setOtp(val)}
                >
                  <InputOTPGroup>
                    {[...Array(5)].map((_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button type="submit" className="w-full mt-4">
                Verify OTP
              </Button>
              <p className="text-center text-gray-600 dark:text-gray-300">
                Didn't receive the code?
                <span className="text-blue-600 cursor-pointer">Resend</span>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OTPverification;
