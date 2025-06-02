import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import envConfig from "@/config/env";
import { connectDB } from "@/config/db";
import { User } from "@/models/userModel";
const { JWT_SECRET } = envConfig;

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return redirect("/auth");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    await connectDB();
    const user = await User.findById(decoded.id);

    if (!user) {
      return redirect("/auth");
    }

    const subscribed =
      user.isSubscribed && user.subscriptionStatus === "active";

    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard</h1>

        {subscribed ? (
          <p className="text-green-600 font-semibold">
            You are subscribed to the {user.subscriptionPlan} plan.
          </p>
        ) : (
          <>
            <p className="text-red-600 font-semibold">
              You are not subscribed.
            </p>
            <a
              href="/subscription"
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Choose a Subscription Plan
            </a>
          </>
        )}
      </div>
    );
  } catch (err) {
    console.error("Error verifying token:", err);
    return redirect("/auth");
  }
}
