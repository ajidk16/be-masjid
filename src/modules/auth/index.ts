import bearer from "@elysiajs/bearer";
import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { CreateMemberBody, SignInBody } from "./model";
import {
  createUser,
  findEmailUnique,
  findPhoneUnique,
  hashPassword,
  verifyPassword,
} from "./service";

export const authController = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      secret: process.env.JWT_SECRET!,
      alg: "HS256",
      exp: "1d", // tokens expire in 1 day
    })
  )
  .use(bearer())
  .post(
    "/sign-out",
    async ({ body: { fullName, email, phone, password }, status }) => {
      const isPhoneUnique = await findPhoneUnique(String(phone));
      if (isPhoneUnique) {
        return status(400, {
          status: 400,
          message: "Phone number already in use",
        });
      }

      const isEmailUnique = await findEmailUnique(String(email));

      if (isEmailUnique) {
        return status(400, {
          status: 400,
          message: "Email address already in use",
        });
      }

      const hashedPassword = await hashPassword(password);

      const res = await createUser(
        fullName,
        email,
        String(phone),
        hashedPassword
      );

      return status(200, {
        status: 200,
        message: "Successfully signed out",
        data: {
          id: res.newUser.id,
          email: res.newUser.email,
          phone: res.newUser.phone,
          fullName: res.newMember.fullName,
        },
      });
    },
    {
      body: CreateMemberBody,
    }
  )
  .post(
    "/sign-in",
    async ({ jwt, body: { email, password }, status }) => {
      const existingUser = await findEmailUnique(String(email));
      console.log(existingUser);
      if (!existingUser) {
        return status(400, {
          status: 400,
          message: "Invalid email",
        });
      }

      const isPasswordValid = await verifyPassword(
        password,
        existingUser.passwordHash
      );
      if (!isPasswordValid) {
        return status(400, {
          status: 400,
          message: "Invalid password",
        });
      }

      console.log("user", existingUser);

      const token = await jwt.sign({
        id: existingUser.id,
        fullName: existingUser?.members?.fullName,
        email: existingUser.email,
        phone: existingUser.phone,
      });

      return status(200, {
        status: 200,
        message: "Successfully signed in",
        data: {
          token,
          expiresIn: "1 day",
        },
      });
    },
    {
      body: SignInBody,
    }
  )
  .get("/profile", async ({ jwt, status, bearer }) => {
    if (!bearer) {
      return status(401, {
        status: 401,
        message: "Token not provided",
      });
    }

    const verified = await jwt.verify(bearer);
    if (!verified) {
      return status(401, {
        status: 401,
        message: "Invalid token",
      });
    }

    return status(200, {
      status: 200,
      message: "User profile data",
      data: verified,
    });
  });
