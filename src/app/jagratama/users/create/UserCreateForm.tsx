'use client'

import ComponentCard from '@/components/common/ComponentCard';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { ChevronDownIcon } from '@/icons';
import { useActionState, useEffect } from 'react';
import { createUserAction, FormState } from '@/app/jagratama/users/actions';
import InputFieldPasword from '@/components/form/input/InputFieldPassword';
import { toast } from "sonner"
import { redirect } from 'next/navigation';
import { RoleModel } from '@/types/role';
import { PositionModel } from '@/types/position';

interface Params {
  roles: RoleModel[]
  positions: PositionModel[]
}

const UserCreateForm = ({ roles, positions }: Params) => {
  const initialState: FormState = {
    success: false,
    message: "",
    errors: {},
  };

  const [state, formAction, isPending] = useActionState(createUserAction, initialState);

  const roleOptions = roles.map((role) => ({
    value: role.id,
    label: role.name,
  }));

  const positionOptions = positions.map((position) => ({
    value: position.id,
    label: position.name,
  }));

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
    <ComponentCard title="Create user">
      <form action={formAction}>
        <div className="space-y-6">
          <div>
            <Label htmlFor='name'>Full Name</Label>
            <Input type="text" id='name' name='name' placeholder="Justin Hubner" />
            {state.errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.name}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor='email'>Email</Label>
            <Input type="email" id='email' name='email' placeholder="jussa@mail.com" />
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
                options={roleOptions}
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
                options={positionOptions}
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

          <div>
            <Label htmlFor='password'>Password</Label>
            <InputFieldPasword name='password' id='password' />
            {state.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.password}
              </p>
            )}
          </div>

          <Button size="md" variant="primary" type='submit' disabled={isPending || state.success} >
            {isPending || state.success ? 'Loading...' : 'Create User'}
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
};

export default UserCreateForm;
