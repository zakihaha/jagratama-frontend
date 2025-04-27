import { auth } from "@/auth";
import { Session } from "next-auth";

const JagratamaIndex = async () => {
  const session = await auth();

  if (!session) {
    return (
      <div>
        <h1>Please log in to access this page.</h1>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1>Welcome, {session.user?.name}</h1>
        <p>Your email: {session.user?.email}</p>
        <p>Your role: {session.user?.role}</p>
      </div>
    </div>
  );
};

export default JagratamaIndex;
