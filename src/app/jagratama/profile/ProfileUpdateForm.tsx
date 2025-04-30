"use client";

import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import { Input } from '@/components/ui/input';
import { UserModel } from '@/types/user';
import { Label } from '@radix-ui/react-label';
import React, { useActionState, useEffect } from 'react';
import { FormState, updateProfileAction } from '../users/actions';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';


const ProfileUpdateForm = ({ user }: { user: UserModel }) => {
  const initialState: FormState = {
    success: false,
    message: "",
    errors: {},
  };

  const [state, formAction, isPending] = useActionState(updateProfileAction, initialState);

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
    <ComponentCard title="Update Profile">
      <form action={formAction}>
        <div className="space-y-6">
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
            <Input type="email" id='email' placeholder="jussa@mail.com" defaultValue={user?.email} disabled />
          </div>

          <div>
            <Label htmlFor='position_id'>Position</Label>
            <Input type="email" id='email' placeholder="jussa@mail.com" defaultValue={user?.position?.name} disabled />
          </div>

          <Button size="md" variant="primary" type='submit' disabled={isPending || state.success} >
            {isPending || state.success ? 'Loading...' : 'Update Profile'}
          </Button>
        </div >
      </form >
    </ComponentCard>
  );
};

export default ProfileUpdateForm;
