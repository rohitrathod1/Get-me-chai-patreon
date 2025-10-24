"use client";
import React, { useEffect, useState } from "react";
import Script from "next/script";
import { fetchuser, fetchpayments, initiate } from "@/actions/useractions";
import { useSearchParams, useRouter } from "next/navigation";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentPage = ({ username }) => {
  const [paymentForm, setPaymentForm] = useState({ name: "", message: "", amount: "" });
  const [currentUser, setCurrentUser] = useState({});
  const [payments, setPayments] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  const dummyProfile = "/dummy profile.jpg"; // add this image in your public folder
  const dummyCover = "/cover.jpeg";     // add this image in your public folder

  useEffect(() => {
    const loadData = async () => {
      const user = await fetchuser(username);
      if (!user) return router.push("/404");
      setCurrentUser(user);

      const dbPayments = await fetchpayments(username);
      setPayments(dbPayments || []);
    };

    loadData();
  }, [username, router]);

  useEffect(() => {
    if (searchParams.get("paymentdone") === "true") {
      toast.success("Thanks for your donation!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
      router.replace(`/${username}`);
    }
  }, [searchParams, router, username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm((prev) => ({ ...prev, [name]: value }));
  };

  const pay = async (amount) => {
    if (!currentUser.razorpayid) return toast.error("Razorpay ID not found");

    const order = await initiate(amount, username, paymentForm);
    if (!order?.id) return toast.error("Failed to create order");

    const options = {
      key: currentUser.razorpayid,
      amount,
      currency: "INR",
      name: "Get Me A Chai",
      description: "Support Transaction",
      image: currentUser.profilepic || dummyProfile,
      order_id: order.id,
      callback_url: `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
      prefill: {
        name: paymentForm.name || "Anonymous",
        email: "",
        contact: "",
      },
      notes: { address: "Get Me A Chai" },
      theme: { color: "#3399cc" },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  };

  const totalRaised = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* Cover & Profile */}
      <div className="cover w-full bg-red-50 relative">
        <img
          className="object-cover w-full h-48 md:h-[350px] shadow-blue-700 shadow-sm"
          src={currentUser.coverpic || dummyCover}
          alt="Cover"
        />
        <div className="absolute -bottom-20 right-[46%] border-2 border-white overflow-hidden rounded-full w-32 h-32">
          <img
            className="rounded-full object-cover w-full h-full"
            src={currentUser.profilepic || dummyProfile}
            alt="Profile"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="info flex flex-col items-center my-24 mb-32 gap-2">
        <div className="font-bold text-lg">@{username}</div>
        <div className="text-slate-400">Let's help {username} get a chai!</div>
        <div className="text-slate-400">
          {payments.length} Payments · ₹{totalRaised} raised
        </div>

        {/* Payment Section */}
        <div className="payment flex flex-col md:flex-row gap-3 w-[80%] mt-11">
          {/* Top Supporters */}
          <div className="supporters w-full md:w-1/2 bg-slate-900 rounded-lg text-white p-10">
            <h2 className="text-2xl font-bold mb-5">Top 10 Supporters</h2>
            <ul className="text-lg space-y-4">
              {payments.length === 0 && <li>No payments yet</li>}
              {payments.map((p, i) => (
                <li key={i} className="flex items-center gap-2">
                  <img width={33} src="avatar.gif" alt="user avatar" />
                  <span>
                    {p.name} donated <strong>₹{p.amount}</strong> with a message "{p.message}"
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Make Payment */}
          <div className="makePayment w-full md:w-1/2 bg-slate-900 rounded-lg text-white p-10 flex flex-col gap-3">
            <h2 className="text-2xl font-bold mb-5">Make a Payment</h2>

            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={paymentForm.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-slate-800"
            />
            <input
              type="text"
              name="message"
              placeholder="Enter Message"
              value={paymentForm.message}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-slate-800"
            />
            <input
              type="number"
              name="amount"
              placeholder="Enter Amount"
              value={paymentForm.amount}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-slate-800"
            />

            <button
              type="button"
              disabled={
                paymentForm.name.length < 3 ||
                paymentForm.message.length < 4 ||
                !paymentForm.amount
              }
              onClick={() => pay(Number(paymentForm.amount) * 100)}
              className="text-white bg-gradient-to-br from-purple-900 to-blue-900 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 disabled:bg-slate-600"
            >
              Pay
            </button>

            {/* Quick Amount Buttons */}
            <div className="flex flex-col md:flex-row gap-2 mt-5">
              {[1000, 2000, 3000].map((amt) => (
                <button
                  key={amt}
                  className="bg-slate-800 p-3 rounded-lg"
                  onClick={() => pay(amt)}
                >
                  Pay ₹{amt / 100}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
