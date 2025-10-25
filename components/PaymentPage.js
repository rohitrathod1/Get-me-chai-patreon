"use client";
import React, { useEffect, useState } from "react";
import Script from "next/script";
import { fetchuser, fetchpayments, initiate } from "@/actions/useractions";
import { useSearchParams, useRouter } from "next/navigation";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

const PaymentPage = ({ username }) => {
  const [paymentForm, setPaymentForm] = useState({ name: "", message: "", amount: "" });
  const [currentUser, setCurrentUser] = useState({});
  const [payments, setPayments] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const dummyProfile = "/images/dummy profile.jpg"; // Default profile
  const dummyCover = "/images/cover.jpeg";          // Default cover
  const blurImage = "/images/blur-placeholder.jpeg"; // Blur placeholder


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
      toast.success("Thanks for your donation!", { theme: "light", transition: Bounce });
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
      prefill: { name: paymentForm.name || "Anonymous" },
      theme: { color: "#3399cc" },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  };

  const totalRaised = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <>
      <ToastContainer />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* Cover & Profile */}
      <div className="relative w-full h-48 md:h-[350px] bg-gray-200">
        <Image
          src={currentUser.coverpic || dummyCover}
          alt="Cover Image"
          fill
          style={{ objectFit: "cover" }}
          placeholder="blur"
          blurDataURL={blurImage}
        />
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-32 h-32 border-4 border-white rounded-full overflow-hidden">
          <Image
            src={currentUser.profilepic || dummyProfile}
            alt="Profile Image"
            width={128}
            height={128}
            style={{ objectFit: "cover" }}
            placeholder="blur"
            blurDataURL={blurImage}
          />
        </div>
      </div>

      {/* User Info */}
      <div className="flex flex-col mb-5 items-center mt-20 gap-2">
        <div className="font-bold text-lg">@{username}</div>
        <div className="text-slate-400">Let&apos;s help {username} get a chai!</div>
        <div className="text-slate-400">{payments.length} Payments · ₹{totalRaised} raised</div>

        {/* Payment Section */}
        <div className="flex flex-col md:flex-row gap-3 w-[80%] mt-11">
          {/* Top Supporters */}
          <div className="w-full md:w-1/2 bg-slate-900 rounded-lg text-white p-10">
            <h2 className="text-2xl font-bold mb-5">Top 10 Supporters</h2>
            <ul className="text-lg space-y-4">
              {payments.length === 0 && <li>No payments yet</li>}
              {payments.map((p, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Image width={33} height={33} src="/avatar.gif" alt="user avatar" />
                  <span>
                    {p.name} donated <strong>₹{p.amount}</strong> with a message &quot;{p.message}&quot;
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Make Payment */}
          <div className="w-full md:w-1/2 bg-slate-900 rounded-lg text-white p-10 flex flex-col gap-3">
            <h2 className="text-2xl font-bold mb-5">Make a Payment</h2>
            <input type="text" name="name" placeholder="Enter Name" value={paymentForm.name} onChange={handleChange} className="w-full p-3 rounded-lg bg-slate-800" />
            <input type="text" name="message" placeholder="Enter Message" value={paymentForm.message} onChange={handleChange} className="w-full p-3 rounded-lg bg-slate-800" />
            <input type="number" name="amount" placeholder="Enter Amount" value={paymentForm.amount} onChange={handleChange} className="w-full p-3 rounded-lg bg-slate-800" />
            <button
              type="button"
              disabled={paymentForm.name.length < 3 || paymentForm.message.length < 4 || !paymentForm.amount}
              onClick={() => pay(Number(paymentForm.amount) * 100)}
              className="text-white bg-gradient-to-br from-purple-900 to-blue-900 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5 disabled:bg-slate-600"
            >
              Pay
            </button>

            <div className="flex flex-col md:flex-row gap-2 mt-5">
              {[1000, 2000, 3000].map((amt) => (
                <button key={amt} className="bg-slate-800 p-3 rounded-lg" onClick={() => pay(amt)}>
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
