import { getUser } from '@/lib/api/users';
import UserUpdateForm from './UserUpdateForm';
import { UserCreateRequest } from '@/types/user';

interface Props {
  params: {
    id: string
  }
}
const UserCreate = async ({ params }: Props) => {
  const user = await getUser(params.id);
  console.log(user);

  const userCreateRequest: UserCreateRequest = {
    name: user.name,
    email: user.email,
    position_id: user.position_id,
    role_id: user.role_id,
    password: '',
  };

  return <UserUpdateForm id={user.id} user={userCreateRequest} />;
};

export default UserCreate;
