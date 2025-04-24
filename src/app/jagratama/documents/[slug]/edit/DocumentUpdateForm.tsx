'use client';

import ComponentCard from '@/components/common/ComponentCard';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { ChevronDownIcon } from '@/icons';
import { useActionState, useEffect, useState } from 'react';
import { FormState, updateDocumentAction } from '@/app/jagratama/documents/actions';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import { DocumentCreateRequest } from '@/types/document';
import TextArea from '@/components/form/input/TextArea';

export default function UserUpdateForm({ slug, document }: { slug: string, document: DocumentCreateRequest }) {
  const initialState: FormState = {
    success: false,
    message: "",
    errors: {},
  };

  const [state, formAction, isPending] = useActionState(updateDocumentAction, initialState);
  const [message, setMessage] = useState<string>(document.description || "");

  const options = [
    { value: 1, label: "Requester" },
    { value: 1, label: "Reviewer" },
    { value: 1, label: "Approver" },
  ];

  useEffect(() => {
    if (state.success) {
      toast.success(state.message)

      setTimeout(() => {
        redirect('/jagratama/documents')
      }, 1500)
    } else if (!state.success && state.message) {
      toast.error(state.message)
    }
  }, [state]);

  return (
    <ComponentCard title="Update user">
      <form action={formAction}>
        <div className="space-y-6">
          <input type="hidden" name="slug" value={slug} />
          <div>
            <Label htmlFor='title'>Title</Label>
            <Input type="text" id='title' name='title' placeholder="Justin Hubner" defaultValue={document.title} />
            {state.errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.title}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor='description'>Description</Label>
            <TextArea
              name='description'
              id='description'
              placeholder="Enter description"
              value={message}
              onChange={(value) => setMessage(value)}
              rows={6}
            />
            {state.errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.description}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor='role_id'>Role</Label>
            <div className="relative">
              <Select
                options={options}
                defaultValue={String(document.category_id)}
                placeholder="Select an option"
                name='role_id'
                id='role_id'
                className="dark:bg-dark-900"
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
            {state.errors.category_id && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.category_id}
              </p>
            )}
          </div>

          <Button size="md" variant="primary" disabled={isPending || state.success} >
            {isPending || state.success ? 'Loading...' : 'Update Document'}
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
}
