export type UserModel = {
  id: number
  name: string
  email: string
  image: string
  role_id: number
  position_id: number
  role: {
    id: number
    name: string
  }
  position: {
    id: number
    name: string
  }
}

export type UserCreateRequest = {
  email: string;
  name: string;
  role_id: number;
  position_id: number;
}

export type UserProfileRequest = {
  image_id?: number | null;
  name: string;
}
