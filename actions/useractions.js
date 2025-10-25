"use server";

import Razorpay from "razorpay";
import Payment from "@/models/Payment";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

// Initiate a Razorpay payment
export const initiate = async (amount, to_username, paymentform) => {
    await connectDb();
    
    // Fetch the user who is receiving the payment
    const user = await User.findOne({ username: to_username });
    if (!user) throw new Error("User not found");
    
    const secret = user.razorpaysecret;
    const instance = new Razorpay({ key_id: user.razorpayid, key_secret: secret });

    const options = {
        amount: Number.parseInt(amount),
        currency: "INR",
    };

    const order = await instance.orders.create(options);

    // Create a pending payment in DB
    await Payment.create({
        oid: order.id,
        amount: amount / 100,
        to_user: to_username,
        name: paymentform.name,
        message: paymentform.message,
    });

    return order;
};

// Fetch user details
export const fetchuser = async (username) => {
    await connectDb();
    const u = await User.findOne({ username: username });
    if (!u) return null;
    return u.toObject({ flattenObjectIds: true });
};

// Fetch top 10 payments for a user
export const fetchpayments = async (username) => {
    await connectDb();
    const payments = await Payment.find({ to_user: username, done: true })
        .sort({ amount: -1 })
        .limit(10)
        .lean();
    return payments;
};

export const updateProfile = async (data, oldusername) => {
    await connectDb();

    // data is already an object, no need for Object.fromEntries
    let ndata = { ...data };

    // Convert username to lowercase if exists
    if (ndata.username) ndata.username = ndata.username.toLowerCase();

    // Check if username is being updated
    if (oldusername !== ndata.username) {
        const existingUser = await User.findOne({ username: ndata.username });
        if (existingUser) {
            return { error: "Username already exists" };
        }

        // Update user info
        await User.updateOne({ email: ndata.email }, ndata);

        // Update all payments to the new username
        await Payment.updateMany({ to_user: oldusername }, { to_user: ndata.username });
    } else {
        // Just update user info if username not changed
        await User.updateOne({ email: ndata.email }, ndata);
    }

    return { success: true };
};
