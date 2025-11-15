import { db } from "../../client";
import {
  mosques,
  refDonationTypes,
  refHalalStatuses,
  refModules,
  refOrderStatuses,
  refPaymentStatuses,
  refPermissions,
  refRoles,
} from "../../schema";

async function main() {
  await db.insert(refRoles).values([
    { code: "admin", label: "Admin", description: "Administrator Sistem" },
    { code: "bendahara", label: "Bendahara", description: "Bendahara Masjid" },
    { code: "pengurus", label: "Pengurus", description: "Pengurus Masjid" },
    { code: "vendor", label: "Vendor", description: "Vendor Masjid" },
    { code: "jamaah", label: "Jamaah", description: "Jamaah Masjid" },
  ]);

  await db.insert(refDonationTypes).values([
    {
      code: "zakat",
      label: "Zakat",
      description: "Zakat Fitrah dan Zakat Mal",
    },
    { code: "infak", label: "Infak", description: "Infak" },
    { code: "sedekah", label: "Sedekah", description: "Sedekah" },
    { code: "wakaf", label: "Wakaf", description: "Wakaf" },
  ]);

  await db.insert(refPaymentStatuses).values([
    { code: "pending", label: "Menunggu Pembayaran" },
    { code: "paid", label: "Sudah Dibayar" },
    { code: "failed", label: "Gagal" },
  ]);

  await db.insert(refOrderStatuses).values([
    { code: "pending", label: "Menunggu" },
    { code: "paid", label: "Dibayar" },
    { code: "delivered", label: "Terkirim" },
  ]);

  await db.insert(refHalalStatuses).values([
    { code: "unverified", label: "Belum Diverifikasi" },
    { code: "verified", label: "Terverifikasi" },
    { code: "expired", label: "Kedaluwarsa" },
  ]);

  await db.insert(mosques).values([
    {
      slug: "masjid-al-falah",
      name: "Masjid Al-Falah",
    },
    {
      slug: "masjid-al-ikhlas",
      name: "Masjid Al-Ikhlas",
    },
  ]);

  await db
    .insert(refModules)
    .values([
      { name: "donations" },
      { name: "orders" },
      { name: "products" },
      { name: "users" },
      { name: "mosques" },
      { name: "payments" },
      { name: "events" },
      { name: "news" },
      { name: "media-photos" },
      { name: "members" },
      { name: "fund-accounts" },
      { name: "campaigns" },
      { name: "expenses" },
      { name: "roles" },
    ]);

  const modules = await db.query.refModules.findMany();
  const findRole = await db.query.refRoles.findMany();

  for (const role of findRole) {
    for (const module of modules) {
      if (role.code === "admin") {
        await db.insert(refPermissions).values({
          roleId: role.id,
          moduleId: module.id,
          canCreate: true,
          canRead: true,
          canUpdate: true,
          canDelete: true,
        });
      } else {
        await db.insert(refPermissions).values({
          roleId: role.id,
          moduleId: module.id,
          canCreate: false,
          canRead: false,
          canUpdate: false,
          canDelete: false,
        });
      }
    }
  }
}

main();
