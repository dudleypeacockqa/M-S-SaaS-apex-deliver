import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  blog: router({
    list: publicProcedure
      .input(z.object({
        category: z.string().optional(),
        search: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getAllBlogPosts(input);
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getBlogPostBySlug(input.slug);
      }),
  }),

  contact: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        company: z.string().optional(),
        message: z.string().min(10),
      }))
      .mutation(async ({ input }) => {
        // Save to database
        await db.createContactSubmission(input);
        
        // Send notification to owner
        const companyInfo = input.company ? ` from ${input.company}` : '';
        await notifyOwner({
          title: `New Contact Form Submission${companyInfo}`,
          content: `**Name:** ${input.name}\n**Email:** ${input.email}\n**Company:** ${input.company || 'Not provided'}\n\n**Message:**\n${input.message}`,
        });
        
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
