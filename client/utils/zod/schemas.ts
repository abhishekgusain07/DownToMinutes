import { z } from "zod";

export const planFormSchema = z.object({
    task: z.string().min(1, 'Task is required'),
    description: z.string().optional(),
    from_time: z.string().min(1, 'Start time is required'),
    to_time: z.string().min(1, 'End time is required'),
    status: z.enum(['NOT_STARTED', 'STARTED', 'IN_PROGRESS', 'NOT_DONE']),
    effectiveness: z.number().min(1).max(10),
    distractions: z.number().min(1).max(10),
    note: z.string().optional(),
});