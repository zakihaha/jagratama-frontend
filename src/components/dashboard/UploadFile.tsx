import { Label } from "@radix-ui/react-label";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { CloudUpload } from "lucide-react";

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function UploadFile({ name }: { name: string }) {
  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      console.log("Accepted file:", file);
    }

    if (fileRejections.length > 0) {
      fileRejections.forEach((rejection: any) => {
        rejection.errors.forEach((error: any) => {
          console.error(
            `Rejected file: ${rejection.file.name}, Reason: ${error.message}`
          );
        });
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      multiple: false,
      maxSize: MAX_FILE_SIZE_BYTES,
      accept: {
        "application/pdf": [".pdf"],
      },
    });

  return (
    <div>
      <Label className="text-[#262626] mb-2 text-sm" htmlFor="filepdf">
        Unggah File
      </Label>
      <div
        {...getRootProps()}
        className={`mt-2 border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${isDragActive ? "border-[#20939C] bg-[#20939C]/10" : "border-[#20939C]"
          }`}
      >
        <input
          {...getInputProps()}
          name={name}
        />
        {isDragActive ? (
          <div className="flex flex-col items-center text-[#262626] px-6 py-10">
            <p className="text-sm">Drop file PDF di sini...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-[#262626] px-6 py-10">
            <CloudUpload className="w-7 h-7 mb-5" />
            <p className="text-sm">
              Drag & Drop or <span className="text-[#20939C]">Choose file</span>{" "}
              to upload (maks. {MAX_FILE_SIZE_MB}MB)
            </p>
            <p className="text-[#A1A1A1] text-xs mt-2">PDF. Max size of 10MB</p>
          </div>
        )}

        {acceptedFiles.length > 0 && (
          <div className="mt-4">
            <p className="font-medium">File terpilih:</p>
            <ul className="text-sm text-gray-700">
              {acceptedFiles.map((file) => (
                <li key={file.name}>
                  {file.name} - {(file.size / 1024 / 1024).toFixed(2)} MB
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
