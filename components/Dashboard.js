"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchuser, updateProfile } from "@/actions/useractions";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({});

  // Fetch user data
  const getData = async () => {
    if (!session) return;
    const userData = await fetchuser(session.user.name);
    setForm(userData || {});
  };

  useEffect(() => {
    if (!session) {
      router.push("/login");
    } else {
      getData();
    }
  }, [session, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) return;

    // Convert username to lowercase and remove spaces
    const sanitizedUsername = form.username
      ? form.username.toLowerCase().replace(/\s+/g, "")
      : "";

    const updatedForm = {
      ...form,
      username: sanitizedUsername,
    };

    const result = await updateProfile(updatedForm, session.user.name);

    if (result?.error) {
      toast.error(result.error, { position: "top-right", autoClose: 5000 });
      return;
    }

    toast.success("Profile Updated", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Bounce,
    });

    // Redirect to /username
    if (sanitizedUsername) router.push(`/${sanitizedUsername}`);
  };

  return (
    <>
      <ToastContainer />
      <div className="container mx-auto py-5 px-6">
        <h1 className="text-center my-5 text-3xl font-bold">
          Welcome to your Dashboard
        </h1>

        <form className="max-w-2xl mx-auto" onSubmit={handleSubmit}>
          {[
            { label: "Name", name: "name", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Username", name: "username", type: "text" },
            { label: "Profile Picture", name: "profilepic", type: "text" },
            { label: "Cover Picture", name: "coverpic", type: "text" },
            { label: "Razorpay Id", name: "razorpayid", type: "text" },
            { label: "Razorpay Secret", name: "razorpaysecret", type: "text" },
          ].map((field) => (
            <div className="my-2" key={field.name}>
              <label
                htmlFor={field.name}
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={form[field.name] || ""}
                onChange={handleChange}
                className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          ))}

          <div className="my-6">
            <button
              type="submit"
              className="block w-full p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-blue-500 focus:ring-4 focus:outline-none dark:focus:ring-blue-800 font-medium text-sm"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Dashboard;
