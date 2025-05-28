import { z } from 'zod';


export const registerUserSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }).min(3, {
      message: "Name must be at least 3 characters",
    }),
    email: z.string({
      required_error: "Email is required",
    }).email({
      message: "Email must be a valid email",
    }),
    password: z.string({
      required_error: "Password is required",
    }).min(6, {
      message: "Password must be at least 6 characters",
    }),
    confirmPassword: z.string({
      required_error: "Confirm Password is required",
    }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "Email is required",
    }).email({
      message: "Email must be a valid email",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string({
      required_error: "Refresh token is required",
    }),
  }),
});

export const authResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    role: z.enum(["ADMIN", "MANAGER"]),
  }),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>['body'];
export type LoginUserInput = z.infer<typeof loginUserSchema>['body'];
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>['body'];
export const logoutResponseSchema = z.object({
    success: z.boolean()
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
export type LogoutResponse = z.infer<typeof logoutResponseSchema>;