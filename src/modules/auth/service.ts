import { db } from "../../db/client";
import {
  emailVerifications,
  invites,
  members,
  passwordResets,
  users,
} from "../../db/schema";
import { and, eq } from "drizzle-orm";

export const createUser = async (
  fullName: string,
  email: string,
  phone: string,
  password: string,
  jwt: any,
  roles?: string,
  mosqueId?: string
) => {
  const result = await db.transaction(async (tx) => {
    const [newUser] = await tx
      .insert(users)
      .values({
        email,
        phone,
        passwordHash: password,
      })
      .returning();

    const [newMember] = await tx
      .insert(members)
      .values({
        userId: newUser.id,
        fullName,
        isActive: false,
        roleId: roles ? roles : null,
        mosqueId: mosqueId ? mosqueId : null,
      })
      .returning();

    const token = await jwt.sign({
      id: newUser.id,
      fullName: newMember.fullName,
      email: newUser.email,
      phone: newUser.phone,
    });

    const [emailVerification] = await tx
      .insert(emailVerifications)
      .values({
        userId: newUser.id,
        token: String(token),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        usedAt: null,
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
      emailVerificationToken: {
        token: emailVerification.token,
        expiresAt: emailVerification.expiresAt,
      },
    };
  });

  return result;
};

export const verifyEmailToken = async (token: string) => {
  const emailVerification = await db.query.emailVerifications.findFirst({
    where: eq(emailVerifications.token, token),
  });

  return emailVerification;
};

// forgot password
export const createTokenPasswordReset = async (
  userId: string,
  token: string
) => {
  const findUserId = await db.query.passwordResets.findFirst({
    where: eq(passwordResets.userId, userId),
  });

  if (findUserId) {
    const [updatedToken] = await db
      .update(passwordResets)
      .set({
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 24 * 1), // 1 day
        usedAt: null,
      })
      .where(eq(passwordResets.userId, userId))
      .returning();

    return updatedToken;
  } else {
    const [newToken] = await db
      .insert(passwordResets)
      .values({
        userId,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 24 * 1), // 1 day
        usedAt: null,
      })
      .returning();

    return newToken;
  }
};

export const updatePasswordResetUsedAt = async (id: string, usedAt: Date) => {
  const [updated] = await db
    .update(passwordResets)
    .set({ usedAt })
    .where(eq(passwordResets.id, id))
    .returning();

  return updated;
};

// create invite token
export const createInvite = async (
  mosqueId: string,
  email: string,
  roleId: string,
  token: string
) => {
  const [newInvite] = await db
    .insert(invites)
    .values({
      mosqueId,
      email,
      roleId,
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 24 * 1), // 1 day
      acceptedAt: null,
    })
    .returning();

  return newInvite;
};

export const updateEmailVerificationUsedAt = async (
  id: string,
  usedAt: Date
) => {
  const [updated] = await db
    .update(emailVerifications)
    .set({ usedAt })
    .where(eq(emailVerifications.id, id))
    .returning();

  return updated;
};

export const updateUserPassword = async (
  userId: string,
  passwordHash: string
) => {
  const [updated] = await db
    .update(users)
    .set({ passwordHash })
    .where(eq(users.id, userId))
    .returning();

  return updated;
};

export const updateUserVerifiedEmail = async (userId: string) => {
  const [updated] = await db
    .update(users)
    .set({ verifiedEmail: true })
    .where(eq(users.id, userId))
    .returning();

  return updated;
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

export const findMembership = async (userId: string) => {
  const membership = await db.query.members.findFirst({
    with: {
      mosque: true,
      role: true,
    },
    where: eq(members.userId, userId),
  });
  return membership;
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
