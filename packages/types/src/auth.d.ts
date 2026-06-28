import z from "zod";
export interface CustomJwtSessionClaims {
    metadata?: {
        role?: "user" | "admin";
    };
}
export declare const UserFormSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    username: z.ZodString;
    emailAddress: z.ZodArray<z.ZodString>;
    password: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=auth.d.ts.map