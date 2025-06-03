import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import envConfig from "@/config/env";
import { connectDB } from "@/config/db";
import { User } from "@/models/userModel";

const { JWT_SECRET } = envConfig;

export default async function DashboardPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

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

    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard</h1>

        {user.isSubscribed ? (
          <div className="bg-green-100 text-green-800 p-4 rounded shadow">
            <p className="font-semibold">
              You are subscribed to the <strong>{user.subscriptionPlan || 'N/A'}</strong> plan.
            </p>
            {user.subscriptionEndsAt && (
              <p>
                Subscription ends on:{" "}
                {new Date(user.subscriptionEndsAt).toLocaleDateString()}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded shadow">
            <p className="mb-2">Hi welecome</p>
            <a
              href="/subscription"
              className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Choose a Subscription Plan
            </a>
          </div>
        )}
      </div>
    );
  } catch (err) {
    console.error("Error verifying token:", err);
    return redirect("/auth");
  }
}
