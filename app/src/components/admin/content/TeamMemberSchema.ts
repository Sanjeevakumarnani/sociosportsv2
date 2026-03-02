
import * as z from 'zod';

export const teamMemberSchema = z.object({
    name: z.string().min(2, "Name is required"),
    role: z.string().min(2, "Role is required"),
    bio: z.string().optional(),
    image: z.string().optional(),
    linkedin: z.string().url("Must be a valid LinkedIn URL").optional().or(z.literal('')),
    quote: z.string().optional(),
    category: z.enum(["LEADERSHIP", "ADVISOR"]),
    order: z.number().optional().default(0)
});

export type TeamMemberFormData = z.infer<typeof teamMemberSchema>;
