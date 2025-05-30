import Image from "next/image";
import { TriangleAlert } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";

const data = [
  {
    name: "Mengirimkan pengajuan",
    time: "21/04/2025, 12:09:48",
    status: "Terkirim",
    note: "-",
    error: "",
    image: "/images/user/owner.jpg",
    color: "bg-[#20939C]",
  },
  {
    name: "Diterima Ketua SBH",
    time: "21/04/2025, 12:09:48",
    status: "Diterima",
    note: "-",
    error: "",
    image: "/images/user/owner.jpg",
    color: "bg-[#20939C]",
  },
  {
    name: "Diterima Ketua SBH",
    time: "21/04/2025, 12:09:48",
    status: "Belum Ada",
    note: "-",
    error: "",
    image: "/images/user/owner.jpg",
    color: "bg-[#EC9346]",
  },
  {
    name: "Pembina BEM",
    time: "21/04/2025, 12:09:48",
    status: "Pending",
    note: "-",
    error: "",
    image: "/images/user/owner.jpg",
    color: "bg-[#20939C]",
  },
  {
    name: "Direvisi Direktur",
    time: "21/04/2025, 12:09:48",
    status: "Pending",
    note: "-",
    error: "",
    image: "/images/user/owner.jpg",
    color: "bg-[#D33126]",
  },
];

export default function ApprovalAccessorTable() {
  return (
    <div className="w-[300px] md:w-full overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="relative pl-6 mt-3 w-full z-1">
          {/* Vertical Line */}
          <div className="absolute left-2 top-10 bottom-8 w-[2px] bg-[#E5E7EB] z-0" />

          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left text-sm text-[#404040] font-normal">
                  Informasi
                </th>
                <th className="text-left text-sm text-[#404040] font-normal">
                  Catatan
                </th>
                <th className="text-left text-sm text-[#404040] font-normal">
                  Status
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} className="align-top">
                  <td
                    className={`py-4 text-sm text-[#262626] relative ${
                      item.status === "Pending" ? "grayscale" : ""
                    }`}
                  >
                    {/* Bullet */}
                    <span
                      className={`absolute left-[-21px] top-7 w-3 h-3 rounded-full z-10 ${item.color}`}
                    />
                    <div className="flex gap-3 items-start">
                      <Image
                        src={item.image}
                        alt="User"
                        width={30}
                        height={30}
                        className="rounded-full mt-1"
                      />
                      <div>
                        <p>{item.name}</p>
                        <p className="text-xs text-[#A1A1A1]">{item.time}</p>
                        {item.error === "" ? (
                          ""
                        ) : (
                          <div className="text-red-600 flex items-center gap-1">
                            <TriangleAlert className="w-4 h-4" /> {item.error}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-[#404040]">
                    {item.note === "-" ? "-" : <div>{item.note}</div>}
                  </td>
                  <td className="py-4">
                    <Badge
                      variant="outline"
                      size="sm"
                      color={
                        item.status === "Diterima"
                          ? "success"
                          : item.status === "Pending"
                          ? "warning"
                          : item.status === "Terkirim"
                          ? "light"
                          : item.status === "Revisi"
                          ? "error"
                          : "light"
                      }
                    >
                      {item.status}
                    </Badge>
                  </td>
                  <td className="py-4 text-end space-x-2">{""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
