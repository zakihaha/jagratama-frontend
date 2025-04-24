"use client";

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import DocumentTracker from '@/components/documents/Tracker';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import { useModal } from '@/hooks/useModal';
import { formatDate } from '@/lib/utils/formatDate';
import { DocumentModel, DocumentTrackingModel } from '@/types/document';

const DocumentDetailPage = ({ document, trackingSteps }: { document: DocumentModel, trackingSteps: DocumentTrackingModel[] }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeModal();
  };

  const currentStepIndex = 3 // Currently at City B

  return (
    <div>
      <PageBreadcrumb pageTitle="Document Detail" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                {document.title}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {document.description}
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      Requester Name
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {document.user.name}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      Requester Email
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {document.user.email}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      Original File
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {document.file_path != "" ? document.file_path : "No file"}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      Date
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {formatDate(document.created_at)}
                    </p>
                  </div>
                  <div>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Tracker
                </p>
                <DocumentTracker steps={trackingSteps} currentStepIndex={currentStepIndex} />
              </div>
            </div>

            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
              <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14">
                  <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Edit Personal Information
                  </h4>
                  <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                    Update your details to keep your profile up-to-date.
                  </p>
                </div>
                <form className="flex flex-col">
                  <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                    <div>
                      <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                        Social Links
                      </h5>

                      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                        <div>
                          <Label>Facebook</Label>
                          <Input
                            type="text"
                            defaultValue="https://www.facebook.com/PimjoHQ"
                          />
                        </div>

                        <div>
                          <Label>X.com</Label>
                          <Input type="text" defaultValue="https://x.com/PimjoHQ" />
                        </div>

                        <div>
                          <Label>Linkedin</Label>
                          <Input
                            type="text"
                            defaultValue="https://www.linkedin.com/company/pimjo"
                          />
                        </div>

                        <div>
                          <Label>Instagram</Label>
                          <Input
                            type="text"
                            defaultValue="https://instagram.com/PimjoHQ"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-7">
                      <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                        Personal Information
                      </h5>

                      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                        <div className="col-span-2 lg:col-span-1">
                          <Label>First Name</Label>
                          <Input type="text" defaultValue="Musharof" />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                          <Label>Last Name</Label>
                          <Input type="text" defaultValue="Chowdhury" />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                          <Label>Email Address</Label>
                          <Input type="text" defaultValue="randomuser@pimjo.com" />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                          <Label>Phone</Label>
                          <Input type="text" defaultValue="+09 363 398 46" />
                        </div>

                        <div className="col-span-2">
                          <Label>Bio</Label>
                          <Input type="text" defaultValue="Team Manager" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                    <Button size="sm" variant="outline" onClick={closeModal}>
                      Close
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailPage;
