import React from 'react';
import DocumentCreateForm from './DocumentCreateForm';
import { fetchCategories } from '@/lib/api/categories';
import { fetchUsersApproverReviewer } from '@/lib/api/users';

const DocumentCreate = async () => {
  const categories = await fetchCategories();
  const users = await fetchUsersApproverReviewer();
  
  return <DocumentCreateForm categories={categories} users={users} />
};

export default DocumentCreate;
