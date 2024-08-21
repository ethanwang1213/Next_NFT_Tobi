export interface User {
    id: number,
    name: string,
    email: string,
    password: string
}

export const userCredentials: User[] = [
  {
    id: 1,
    name: "Inuta",
    email: "inuta@gmail.com",
    password: "password123",
  },
  {
    id: 2,
    name: "Keisuke",
    email: "keisuke@gmail.com",
    password: "password123",
  },
  {
    id: 3,
    name: "Artem",
    email: "artem@gmail.com",
    password: "password123",
  },
];
export const jwtSecretKey = process.env.JWT_SECRET_KEY??"Tobiratory";
