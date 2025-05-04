'use client'

import ComponentCard from '@/components/common/ComponentCard';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { ChevronDownIcon } from '@/icons';
import { useActionState, useEffect, useState } from 'react';
import { createDocumentAction, FormState } from '@/app/jagratama/documents/actions';
import { toast } from "sonner"
import { redirect } from 'next/navigation';
import TextArea from '@/components/form/input/TextArea';
import { MultiSelectOption, Option } from '@/components/form/input/MultiSelectOption';

const DocumentCreate = () => {
  const initialState: FormState = {
    success: false,
    message: "",
    errors: {},
  };

  const [state, formAction, isPending] = useActionState(createDocumentAction, initialState);
  const [message, setMessage] = useState<string>("")
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])

  const options = [
    { value: 1, label: "Cat 1" },
    { value: 2, label: "Cat 2" },
    { value: 3, label: "Cat 3" },
  ];

  // Sample data for demonstration
  const COUNTRIES: Option[] = [
    { value: "reviewer@gmail.com", label: "Akun Reviewer" },
    { value: "approver@gmail.com", label: "Akun Approver" },
    { value: "admin@gmail.com", label: "Akun Admin" },
  ]

  const handleSubmit = async (formData: FormData) => {
    // Append selectedCountries as JSON string
    formData.append("approvers", JSON.stringify(selectedCountries));

    formAction(formData); // Call the action
  };

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
    <ComponentCard title="Create user">
      <form action={handleSubmit}>
        <div className="space-y-6">
          <div>
            <Label htmlFor='title'>Title</Label>
            <Input type="text" id='title' name='title' placeholder="Justin Hubner" />
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
            <Label htmlFor='category_id'>Category</Label>
            <div className="relative">
              <Select
                options={options}
                placeholder="Select an option"
                name='category_id'
                id='category_id'
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

          <div>
            <Label htmlFor='approvers'>Approvers</Label>
            <MultiSelectOption
              options={COUNTRIES}
              selected={selectedCountries}
              onChange={setSelectedCountries}
              placeholder="Select countries..."
              searchPlaceholder="Search countries..."
            />
          </div>

          <Button size="md" variant="primary" type='submit' disabled={isPending || state.success}>
            {isPending || state.success ? 'Loading...' : 'Create Document'}
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
};

export default DocumentCreate;
