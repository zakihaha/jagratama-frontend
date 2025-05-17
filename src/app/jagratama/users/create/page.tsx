import { fetchRoles } from '@/lib/api/roles';
import UserCreateForm from './UserCreateForm';
import { fetchPositions } from '@/lib/api/positions';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "JAGRATAMA | Dashboard Pengajuan Dokumen",
  description:
    "JAGRATAMA adalah dashboard digital untuk pengajuan, pelacakan, dan pengelolaan dokumen secara mudah dan efisien",
};

const UserCreate = async () => {
  const roles = await fetchRoles();
  const positions = await fetchPositions();

  return <UserCreateForm roles={roles} positions={positions} />
}

export default UserCreate;
