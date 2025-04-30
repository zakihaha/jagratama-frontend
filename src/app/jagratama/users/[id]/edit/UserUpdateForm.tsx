'use client';

import ComponentCard from '@/components/common/ComponentCard';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { ChevronDownIcon } from '@/icons';
import { useActionState, useEffect } from 'react';
import { FormState, updateUserAction } from '@/app/jagratama/users/actions';
import { UserCreateRequest } from '@/types/user';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';

export default function UserUpdateForm({ id, user }: { id: number, user: UserCreateRequest }) {
  const initialState: FormState = {
    success: false,
    message: "",
    errors: {},
  };

  const [state, formAction, isPending] = useActionState(updateUserAction, initialState);

  const options = [
    { value: 1, label: "Requester" },
    { value: 1, label: "Reviewer" },
    { value: 1, label: "Approver" },
  ];

  useEffect(() => {
    if (state.success) {
      toast.success(state.message)

      setTimeout(() => {
        redirect('/jagratama/users')
      }, 1500)
    } else if (!state.success && state.message) {
      toast.error(state.message)
    }
  }, [state]);

  return (
    <ComponentCard title="Update user">
      <form action={formAction}>
        <div className="space-y-6">
          <input type="hidden" name="id" value={id} />
          <div>
            <Label htmlFor='name'>Full Name</Label>
            <Input type="text" id='name' name='name' placeholder="Justin Hubner" defaultValue={user?.name} />
            {state.errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.name}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor='email'>Email</Label>
            <Input type="email" id='email' name='email' placeholder="jussa@mail.com" defaultValue={user?.email} />
            {state.errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.email}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor='role_id'>Role</Label>
            <div className="relative">
              <Select
                options={options}
                defaultValue={String(user?.role_id)}
                placeholder="Select an option"
                name='role_id'
                id='role_id'
                className="dark:bg-dark-900"
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
            {state.errors.role_id && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.role_id}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor='position_id'>Position</Label>
            <div className="relative">
              <Select
                options={options}
                defaultValue={String(user?.position_id)}
                placeholder="Select an option"
                name='position_id'
                id='position_id'
                className="dark:bg-dark-900"
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
            {state.errors.position_id && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.position_id}
              </p>
            )}
          </div>

          <Button size="md" variant="primary" type='submit' disabled={isPending || state.success} >
            {isPending || state.success ? 'Loading...' : 'Update User'}
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
}
