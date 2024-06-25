import { z } from "zod";

export const parseStringToInteger = () =>
  z
    .string()
    // .default(defaultValue)
    .transform((val, ctx) => {
      const number = Number(val);
      if (Number.isNaN(number)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "el valor no es un numero",
        });

        return z.NEVER;
      }

      if (!Number.isInteger(number)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "el numero no es un entero",
        });

        return z.NEVER;
      }

      return number;
    });
