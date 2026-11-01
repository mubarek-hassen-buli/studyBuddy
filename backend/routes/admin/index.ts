import { Elysia } from "elysia";
import { adminGuard } from "../../middleware/admin-guard";
import { adminAnalyticsRoutes } from "./analytics";
import { adminUsersRoutes } from "./users";
import { adminMaterialsRoutes } from "./materials";
import { adminAuditLogsRoutes } from "./audit-logs";
import { adminSubscriptionsRoutes } from "./subscriptions";

export const adminRoutes = new Elysia({ prefix: "/api/admin" })
  .use(adminGuard)
  .get("/me", ({ adminUser, set }) => {
    if (!adminUser) {
      set.status = 401;
      return {
        error: "Unauthorized",
        message: "Authentication required to access admin portal",
      };
    }
    return {
      user: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        tier: adminUser.tier,
        image: adminUser.image,
      },
    };
  })
  .use(adminAnalyticsRoutes)
  .use(adminUsersRoutes)
  .use(adminMaterialsRoutes)
  .use(adminAuditLogsRoutes)
  .use(adminSubscriptionsRoutes);
