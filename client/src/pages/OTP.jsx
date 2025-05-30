import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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

const OTP = () => {
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
    <>
      <div className="flex py-20 w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6"></div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">OTP</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
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
                    Didn't receive the code? &nbsp;
                    <span className="text-blue-600 cursor-pointer">Resend</span>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OTP;
