import { SettingsForm } from "@/components/admin/settings/settings-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";

export default async function AdminSettingsPage() {
  await requireRole("ADMIN");

  const settings = await prisma.storeSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton" },
    update: {},
  });

  return (
    <div>
      <PageHeader title="Settings" description="Store-wide configuration." />
      <SettingsForm
        defaultValues={{
          storeName: settings.storeName,
          supportEmail: settings.supportEmail,
          currency: settings.currency,
          timezone: settings.timezone,
          maintenanceMode: settings.maintenanceMode,
        }}
      />
    </div>
  );
}
