import bearer from "@elysiajs/bearer";
import jwt from "@elysiajs/jwt";
import Elysia, { t } from "elysia";
import {
  CreateMemberBody,
  InviteMemberBody,
  resetPasswordBody,
  SignInBody,
} from "./model";
import {
  createInvite,
  createTokenPasswordReset,
  createUser,
  findEmailUnique,
  findMembership,
  findPhoneUnique,
  hashPassword,
  updateEmailVerificationUsedAt,
  updatePasswordResetUsedAt,
  updateUserPassword,
  updateUserVerifiedEmail,
  verifyEmailToken,
  verifyPassword,
} from "./service";
import { sendEmailToGmail } from "../../lib/shared/send-email";

export const authController = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      secret: process.env.JWT_SECRET!,
      alg: "HS256",
      exp: "1d",
    })
  )
  .use(bearer())
  .post(
    "/sign-out",
    async ({ jwt, body: { fullName, email, phone, password }, status }) => {
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
        hashedPassword,
        jwt
      );

      if (!res) {
        return status(500, {
          status: 500,
          message: "Failed to create user",
        });
      }

      // send email use resend or other service
      await sendEmailToGmail({
        email: res.newUser.email,
        subject: "Verifikasi Email Akun Masjid Digital",
        expiresInMin: "1 jam",
        verifyUrl: `${process.env.FRONTEND_URL}/verify-email?token=${res.emailVerificationToken.token}`,
        logoUrl: "https://masjid.id/logo.png",
      });

      return status(200, {
        status: 200,
        message: "Successfully signed out",
        data: {
          id: res.newUser.id,
          email: res.newUser.email,
          phone: res.newUser.phone,
          fullName: res.newMember.fullName,
          emailVerificationToken: {
            token: res.emailVerificationToken.token,
            expiresAt: res.emailVerificationToken.expiresAt,
          },
        },
      });
    },
    {
      body: CreateMemberBody,
    }
  )
  .get("/verify/:token", async ({ jwt, params: { token }, status }) => {
    const verified = await jwt.verify(String(token));
    if (!verified) {
      return status(400, {
        status: 400,
        message: "Invalid or expired token",
      });
    }

    const findUser = await findEmailUnique(String(verified.email));
    if (!findUser) {
      return status(400, {
        status: 400,
        message: "User not found",
      });
    }

    const emailVerification = await verifyEmailToken(String(token));
    if (!emailVerification) {
      return status(400, {
        status: 400,
        message: "Invalid or expired email verification token",
      });
    }

    const updatedEmailVerification = await updateEmailVerificationUsedAt(
      emailVerification.id,
      new Date()
    );
    if (!updatedEmailVerification) {
      return status(500, {
        status: 500,
        message: "Failed to update email verification",
      });
    }

    const updatedUser = await updateUserVerifiedEmail(findUser.id);
    if (!updatedUser) {
      return status(500, {
        status: 500,
        message: "Failed to update user",
      });
    }

    return status(200, {
      status: 200,
      message: "Token is valid",
      data: verified,
    });
  })
  .post(
    "/sign-in",
    async ({ jwt, body: { email, password }, status }) => {
      const existingUser = await findEmailUnique(String(email));
      if (!existingUser) {
        return status(400, {
          status: 400,
          message: "Invalid email",
        });
      }

      const membership = await findMembership(existingUser.id);

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

      const token = await jwt.sign({
        id: existingUser.id,
        fullName: existingUser?.members?.fullName,
        email: existingUser.email,
        phone: existingUser.phone,
      });

      return status(200, {
        status: 200,
        message: "Successfully signed in",
        token: token,
        user: existingUser,
        membership: {
          mosqueId: membership?.mosqueId,
          roleId: membership?.roleId,
          slug: membership?.mosque?.slug,
        },
      });
    },
    {
      body: SignInBody,
    }
  )
  .post(
    "/forgot-password",
    async ({ jwt, body: { email }, status }) => {
      const existingUser = await findEmailUnique(email);
      if (!existingUser) {
        return status(400, {
          status: 400,
          message: "Email not found",
        });
      }

      const token = await jwt.sign({
        id: existingUser.id,
        email: existingUser.email,
      });

      const sendTokenToPasswordResetEmail = await createTokenPasswordReset(
        existingUser.id,
        String(token)
      );
      if (!sendTokenToPasswordResetEmail) {
        return status(500, {
          status: 500,
          message: "Failed to create password reset token",
        });
      }

      // send email use resend or other service
      await sendEmailToGmail({
        email: existingUser.email,
        subject: "Password Reset Instructions",
        expiresInMin: "1 day",
        verifyUrl: `${process.env.URL_FRONTEND}/auth/reset-password?token=${token}`,
      });

      return status(200, {
        status: 200,
        message: "Password reset instructions sent to email",
        data: { token },
      });
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
      }),
    }
  )
  .post(
    "/reset-password",
    async ({ body: { token, newPassword }, jwt, status }) => {
      const verified = await jwt.verify(String(token));
      if (!verified) {
        return status(400, {
          status: 400,
          message: "Invalid or expired token",
        });
      }

      const existingUser = await findEmailUnique(String(verified.email));
      if (!existingUser) {
        return status(400, {
          status: 400,
          message: "User not found",
        });
      }

      const hashedPassword = await hashPassword(newPassword);
      const updatedUser = await updateUserPassword(
        existingUser.id,
        hashedPassword
      );
      if (!updatedUser) {
        return status(500, {
          status: 500,
          message: "Failed to update password",
        });
      }

      await updatePasswordResetUsedAt(String(verified.id), new Date());

      return status(200, {
        status: 200,
        message: "Password successfully updated",
        data: null,
      });
    },
    {
      body: resetPasswordBody,
    }
  )
  .post(
    "/members/invite",
    async ({ jwt, body: { mosqueId, email, roleId }, status, bearer }) => {
      // buatk token di table invite
      const verified = await jwt.verify(bearer);
      if (!verified) {
        return status(401, {
          status: 401,
          message: "Invalid token",
        });
      }

      const token = await jwt.sign({
        mosqueId,
        email,
        roleId,
      });

      // simpan ke table invites
      const invite = await createInvite(
        mosqueId,
        email,
        String(roleId),
        String(token)
      );
      if (!invite) {
        return status(500, {
          status: 500,
          message: "Failed to create invite",
        });
      }

      // kirim email undangan pakai resend atau layanan lain
      await sendEmailToGmail({
        email: invite.email,
        subject: "Undangan Bergabung sebagai Member",
        expiresInMin: "1 jam",
        verifyUrl: `${process.env.FRONTEND_URL}/invite/accept?token=${invite.token}`,
        logoUrl: "https://masjid.id/logo.png",
      });

      return status(200, {
        status: 200,
        message: "Invite accepted",
        data: null,
      });
    },
    {
      body: InviteMemberBody,
    }
  )
  .post(
    "/members/accept",
    async ({ jwt, body: { token }, status }) => {
      const verified = await jwt.verify(String(token));
      if (!verified) {
        return status(400, {
          status: 400,
          message: "Invalid or expired token",
        });
      }

      const newUser = await createUser(
        "user from invite", // fullName
        String(verified.email),
        "0000000000", // phone
        "temporaryPassword", // password
        jwt,
        String(verified.roleId),
        String(verified.mosqueId)
      );

      if (!newUser) {
        return status(500, {
          status: 500,
          message: "Failed to accept invite",
        });
      }

      return status(200, {
        status: 200,
        message: "Invite accepted successfully",
        data: null,
      });
    },
    {
      body: t.Object({
        token: t.String(),
      }),
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
