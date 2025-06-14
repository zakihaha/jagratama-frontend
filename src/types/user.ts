export type UserModel = {
  id: number
  name: string
  email: string
  image: string
  role_id: number
  position_id: number
  organization?: string
  role: {
    id: number
    name: string
  }
  position: {
    id: number
    name: string
  }
}

export type UserModelWithPagination = {
  data: UserModel[]
  total_data: number
  limit: number
  page: number
  total_page: number
}

export type UserCreateRequest = {
  email: string;
  name: string;
  role_id: number;
  position_id: number;
  organization?: string;
}

export type UserProfileRequest = {
  image_id?: number | null;
  name: string;
}

export type UserPasswordRequest = {
  old_password: string;
  new_password: string;
}
