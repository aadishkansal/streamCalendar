import { z } from "zod";
import { usernameValidation } from "./signUpSchema";

export const usernameQuerySchema = z.object({
    username: usernameValidation,
})