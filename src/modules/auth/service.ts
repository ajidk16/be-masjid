import { db } from "../../db/client";
import * as bcrypt from "bcrypt";
import { members, users } from "../../db/schema";
import { eq } from "drizzle-orm";

export const createUser = async (
  fullName: string,
  email: string,
  phone: string,
  password: string
) => {
  // Implementation for creating a member

  const [newUser] = await db
    .insert(users)
    .values({
      email,
      phone,
      passwordHash: password,
    })
    .returning();

  const [newMember] = await db
    .insert(members)
    .values({
      userId: newUser.id,
      fullName,
      isActive: false,
    })
    .returning();

  return {
    newUser: {
      id: newUser.id,
      email: newUser.email,
      phone: newUser.phone,
    },
    newMember: {
      id: newMember.id,
      fullName: newMember.fullName,
    },
  };
};

export const findPhoneUnique = async (phone: string) => {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.phone, phone),
  });

  return existingUser;
};

export const findEmailUnique = async (email: string) => {
  const existingUser = await db.query.users.findFirst({
    columns: {
      id: true,
      email: true,
      phone: true,
      passwordHash: true,
    },
    with: {
      members: {
        columns: {
          fullName: true,
        },
        with: {
          mosque: {
            columns: {
              id: true,
              slug: true,
              name: true,
              address: true,
              city: true,
              province: true,
              lat: true,
              lng: true,
            },
          },
        },
      },
    },

    where: eq(users.email, email),
  });
  return existingUser;
};

export const getUserProfile = async (userId: string) => {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
    columns: {
      id: true,
      email: true,
      phone: true,
      verifiedEmail: true,
      createdAt: true,
    },
  });
  return user;
};

// export const hashPassword = async (password: string) => {
//   const saltRounds = 10;
//   return await bcrypt.hash(password, saltRounds);
// };

// export const verifyPassword = async (
//   plainPassword: string,
//   hashedPassword: string
// ) => {
//   return await bcrypt.compare(plainPassword, hashedPassword);
// };

export const hashPassword = async (password: string) => {
  return Bun.password.hash(password, {
    algorithm: "argon2id",
    memoryCost: 19456,
    timeCost: 2,
  });
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  const isValid = await Bun.password.verify(password, hashedPassword);
  return isValid;
};
