import z from "zod";

export const createTeamSchema = z
  .object({
    teamName: z.string().min(1, "Team name is required").trim(),
  })
  .strict();


  export const addTeamMemberSchema = z.object({
  memberId: z.string().min(1, "User ID is required"),
  role: z.enum(["MEMBER", "EDITOR"]),
});

export const updateTeamMemberSchema = z.object({
    role: z.enum(["VIEWER", "EDITOR"]), // cannot assign ADMIN
}).strict();

export type createTeamInput = z.infer<typeof createTeamSchema>;
export type addTeamMemberInput = z.infer<typeof addTeamMemberSchema>;
export type updateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>;


