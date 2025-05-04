import { auth } from "@/auth";
import { fetchDocumentCounter } from "@/lib/api/documents";

const JagratamaIndex = async () => {
  const session = await auth();
  const documentCounter = await fetchDocumentCounter();
  const { total_document, total_rejected, total_pending, total_approved } = documentCounter;

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
        <p>Your position: {session.user?.position}</p>
      </div>
      <div>
        <h2>Document Statistics</h2>
        <ul>
          <li>Total Documents: {total_document}</li>
          <li>Total Rejected: {total_rejected}</li>
          <li>Total Pending: {total_pending}</li>
          <li>Total Approved: {total_approved}</li>
        </ul>
      </div>
    </div>
  );
};

export default JagratamaIndex;
