import { db } from "../../client";
import {
  mosques,
  refDonationTypes,
  refHalalStatuses,
  refOrderStatuses,
  refPaymentStatuses,
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
}

main();
