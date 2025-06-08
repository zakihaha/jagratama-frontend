import { Metadata } from "next";
import { fetchDocuments } from "@/lib/api/documents";
import TabRiwayatPengajuan from "./TabRiwayatPengajuan";

export const metadata: Metadata = {
  title: "JAGRATAMA | Dashboard Pengajuan Dokumen",
  description: "JAGRATAMA adalah dashboard digital untuk pengajuan, pelacakan, dan pengelolaan dokumen secara mudah dan efisien",
};

const RiwayatPengajuanPage = async () => {
  const documents = await fetchDocuments();

  return <TabRiwayatPengajuan documents={documents.data} />;
};

export default RiwayatPengajuanPage;
