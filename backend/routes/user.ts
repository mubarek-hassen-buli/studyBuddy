import { Elysia } from "elysia";
import { auth } from "../auth";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { uploadToImageKit } from "../services/document-processor";

export const userRoutes = new Elysia({ prefix: "/api/user" })
  // 1. Upload & update profile avatar
  .post("/avatar", async ({ request, set }) => {
    try {
      const session = await auth.api.getSession({ headers: request.headers });
      if (!session?.user?.id) {
        set.status = 401;
        return { error: "Unauthorized", message: "Authentication required" };
      }

      const formData = await request.formData();
      const file = formData.get("avatar") as File | null;

      if (!file) {
        set.status = 400;
        return { error: "BadRequest", message: "Avatar image file is required" };
      }

      if (!file.type.startsWith("image/")) {
        set.status = 400;
        return {
          error: "BadRequest",
          message: "Only image files (JPEG, PNG, WEBP, GIF) are allowed for avatars",
        };
      }

      // Max 5MB limit
      if (file.size > 5 * 1024 * 1024) {
        set.status = 400;
        return { error: "BadRequest", message: "Avatar file size must be less than 5MB" };
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const safeName = `avatar_${session.user.id}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

      const uploadResult = await uploadToImageKit(safeName, buffer, "/studybuddy_avatars");

      if (!uploadResult?.url) {
        set.status = 500;
        return { error: "UploadError", message: "Failed to upload avatar image to storage" };
      }

      // Update user record in database
      await db
        .update(users)
        .set({
          image: uploadResult.url,
          updatedAt: new Date(),
        })
        .where(eq(users.id, session.user.id));

      return {
        success: true,
        message: "Profile avatar updated successfully",
        imageUrl: uploadResult.url,
      };
    } catch (error) {
      console.error("[UserRoutes] Failed to upload avatar:", error);
      set.status = 500;
      return {
        error: "InternalServerError",
        message: error instanceof Error ? error.message : "Failed to upload avatar",
      };
    }
  })

  // 2. Remove profile avatar
  .delete("/avatar", async ({ request, set }) => {
    try {
      const session = await auth.api.getSession({ headers: request.headers });
      if (!session?.user?.id) {
        set.status = 401;
        return { error: "Unauthorized", message: "Authentication required" };
      }

      await db
        .update(users)
        .set({
          image: null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, session.user.id));

      return {
        success: true,
        message: "Profile avatar removed successfully",
      };
    } catch (error) {
      console.error("[UserRoutes] Failed to remove avatar:", error);
      set.status = 500;
      return {
        error: "InternalServerError",
        message: error instanceof Error ? error.message : "Failed to remove avatar",
      };
    }
  })

  // 3. Update profile details (e.g. name)
  .patch("/profile", async ({ request, body, set }) => {
    try {
      const session = await auth.api.getSession({ headers: request.headers });
      if (!session?.user?.id) {
        set.status = 401;
        return { error: "Unauthorized", message: "Authentication required" };
      }

      const { name } = body as { name?: string };
      if (!name || !name.trim()) {
        set.status = 400;
        return { error: "BadRequest", message: "Name cannot be empty" };
      }

      await db
        .update(users)
        .set({
          name: name.trim(),
          updatedAt: new Date(),
        })
        .where(eq(users.id, session.user.id));

      return {
        success: true,
        message: "Profile updated successfully",
        user: {
          id: session.user.id,
          name: name.trim(),
        },
      };
    } catch (error) {
      console.error("[UserRoutes] Failed to update profile:", error);
      set.status = 500;
      return {
        error: "InternalServerError",
        message: error instanceof Error ? error.message : "Failed to update profile",
      };
    }
  });

