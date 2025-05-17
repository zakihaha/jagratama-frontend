import React from 'react';
import DocumentCreateForm from './DocumentCreateForm';
import { fetchCategories } from '@/lib/api/categories';
import { fetchUsersApproverReviewer } from '@/lib/api/users';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "JAGRATAMA | Dashboard Pengajuan Dokumen",
  description:
    "JAGRATAMA adalah dashboard digital untuk pengajuan, pelacakan, dan pengelolaan dokumen secara mudah dan efisien",
};

const DocumentCreate = async () => {
  const categories = await fetchCategories();
  const users = await fetchUsersApproverReviewer();
  
  return <DocumentCreateForm categories={categories} users={users} />
};

export default DocumentCreate;
