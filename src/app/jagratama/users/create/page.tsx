import { fetchRoles } from '@/lib/api/roles';
import UserCreateForm from './UserCreateForm';
import { fetchPositions } from '@/lib/api/positions';

const UserCreate = async () => {
  const roles = await fetchRoles();
  const positions = await fetchPositions();

  return <UserCreateForm roles={roles} positions={positions} />
}

export default UserCreate;
