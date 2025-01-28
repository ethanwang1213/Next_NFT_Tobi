export interface User {
    id: number,
    name: string,
    email: string,
    hashedPassword: string
}

export const userCredentials: User[] = [
  {
    id: 1,
    name: "Inuta",
    email: "inuta@gmail.com",
    hashedPassword: "$2b$10$x.SejF52tqen8zDS8Mdqfe.8Shjvcw8qAkMZCZEyFlMaC4Xj30/Pu",
  },
  {
    id: 2,
    name: "Keisuke",
    email: "keisuke@gmail.com",
    hashedPassword: "$2b$10$DYs4dkvlDSzWZAE2OkCA4ejpSgD5BtAQO2gKkOo8E/gvFJJY2pCte",
  },
  {
    id: 3,
    name: "Artem",
    email: "artem@gmail.com",
    hashedPassword: "$2b$10$e4U6QtNeq0u4ZirOqK/l7OHaUlA6UBJyBWyfedtjZ5yxVXz4.KuxK",
  },
];
export const jwtSecretKey = process.env.JWT_SECRET_KEY??"Tobiratory";
