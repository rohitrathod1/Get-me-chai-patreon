import React from 'react';
import PaymentPage from '@/components/PaymentPage';
import { notFound } from 'next/navigation';
import connectDb from '@/db/connectDb';
import User from '@/models/User';

const Username = async ({ params }) => {
  // ✅ Connect to DB once and check for user
  await connectDb();
  const user = await User.findOne({ username: params.username });

  if (!user) {
    // ✅ Return 404 page if username does not exist
    notFound();
  }

  return <PaymentPage username={params.username} />;
};

export default Username;

// ✅ SEO Metadata
export async function generateMetadata({ params }) {
  return {
    title: `Support ${params.username} - Get Me A Chai`,
    description: `Support ${params.username} securely through Get Me A Chai platform.`,
  };
}
