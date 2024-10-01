import Background from "../../assets/login3.png";
import Victory from "../../assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/lib/constants";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
import { motion } from "framer-motion";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

// Validation functions
const validateEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return emailPattern.test(email);
};

const validateLogin = (email, password) => {
  if (!email.length) {
    toast.error("Email is required.");
    return false;
  }
  if (!validateEmail(email)) {
    toast.error("Email should be a valid gmail address.");
    return false;
  }
  if (!password.length) {
    toast.error("Password is required.");
    return false;
  }
  return true;
};

const validateSignup = (email, password, confirmPassword) => {
  if (!email.length) {
    toast.error("Email is required.");
    return false;
  }
  if (!validateEmail(email)) {
    toast.error("Email should be a valid gmail address.");
    return false;
  }
  if (!password.length) {
    toast.error("Password is required.");
    return false;
  }
  if (password !== confirmPassword) {
    toast.error("Password and Confirm Password should be the same.");
    return false;
  }
  return true;
};

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = async () => {
    if (validateLogin(email, password)) {
      try {
        const response = await apiClient.post(
          LOGIN_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (response.data.user.id) {
          setUserInfo(response.data.user);
          navigate(response.data.user.profileSetup ? "/chat" : "/profile");
        } else {
          toast.error("Login failed. Please try again.");
        }
      } catch (error) {
        toast.error("An error occurred during login.");
        console.error(error);
      }
    }
  };

  const handleSignup = async () => {
    if (validateSignup(email, password, confirmPassword)) {
      try {
        const response = await apiClient.post(
          SIGNUP_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (response.status === 201) {
          setUserInfo(response.data.user);
          navigate("/profile");
        } else {
          toast.error("Signup failed. Please try again.");
        }
      } catch (error) {
        toast.error("An error occurred during signup.");
        console.error(error);
      }
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const googleResponse = await apiClient.post(
        "/auth/google",
        { token: response.credential },
        { withCredentials: true }
      );
      if (googleResponse.data.user.id) {
        setUserInfo(googleResponse.data.user);
        navigate(googleResponse.data.user.profileSetup ? "/chat" : "/profile");
      } else {
        toast.error("Google login failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during Google login.");
      console.error(error);
    }
  };

  const handleGoogleFailure = (error) => {
    toast.error("Google login failed. Please try again.");
    console.error(error);
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="h-[100vh] w-[100vw] flex items-center justify-center bg-gray-100">
        <motion.div
          className="h-[80vh] bg-white border-2 border-white shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col gap-10 items-center justify-center p-10">
            <motion.div
              className="flex items-center justify-center flex-col"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex items-center justify-center">
                <h1 className="text-5xl md:text-6xl font-bold">Welcome</h1>
                <motion.img
                  src={Victory}
                  alt="Victory"
                  className="h-[100px] ml-4 victory-image"
                  initial={{ opacity: 7 }}
                  animate={{ opacity: [1, 1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
              <p className="font-medium text-center mt-4">
                Fill in the details to get started with the best chat app!
              </p>
            </motion.div>
            <div className="flex items-center justify-center w-full mt-10">
              <Tabs defaultValue="login" className="w-3/4">
                <TabsList className="bg-transparent rounded-none w-full">
                  <TabsTrigger
                    className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                    value="login"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                    value="signup"
                  >
                    Signup
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="flex flex-col gap-5 mt-10">
                  <Input
                    placeholder="Email"
                    type="email"
                    className="rounded-full p-6"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email"
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    className="rounded-full p-6"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-label="Password"
                  />
                  <Button
                    className="rounded-full p-6 bg-purple-500 text-white hover:bg-purple-600 transition-all duration-300"
                    onClick={handleLogin}
                  >
                    Login
                  </Button>
                  <div className="flex items-center justify-center mt-4">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onFailure={handleGoogleFailure}
                      buttonText="Sign in with Google"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="signup" className="flex flex-col gap-5">
                  <Input
                    placeholder="Email"
                    type="email"
                    className="rounded-full p-6"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email"
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    className="rounded-full p-6"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-label="Password"
                  />
                  <Input
                    placeholder="Confirm Password"
                    type="password"
                    className="rounded-full p-6"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    aria-label="Confirm Password"
                  />
                  <Button
                    className="rounded-full p-6 bg-purple-500 text-white hover:bg-purple-600 transition-all duration-300"
                    onClick={handleSignup}
                  >
                    Signup
                  </Button>
                  <div className="flex items-center justify-center mt-4">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onFailure={handleGoogleFailure}
                      buttonText="Sign up with Google"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <motion.div
            className="hidden xl:flex justify-center items-center"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <img src={Background} alt="Background" className="h-[700px]" />
          </motion.div>
        </motion.div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Auth;
