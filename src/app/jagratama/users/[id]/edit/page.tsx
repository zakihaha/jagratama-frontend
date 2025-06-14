import { getUser } from '@/lib/api/users';
import UserUpdateForm from './UserUpdateForm';
import { UserCreateRequest } from '@/types/user';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "JAGRATAMA | Dashboard Pengajuan Dokumen",
  description:
    "JAGRATAMA adalah dashboard digital untuk pengajuan, pelacakan, dan pengelolaan dokumen secara mudah dan efisien",
};

type Params = Promise<{ id: string }>

const UserEdit = async ({ params }: { params: Params }) => {
  const { id } = await params;
  const user = await getUser(id);

  const userCreateRequest: UserCreateRequest = {
    name: user.name,
    email: user.email,
    position_id: user.position_id,
    role_id: user.role_id,
  };

  return <></>;
};

export default UserEdit;
