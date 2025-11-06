// OtpEmail.tsx
import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
  Img,
} from "@react-email/components";

type OtpEmailProps = {
  appName?: string;
  otp?: string; // "123456"
  expiresInMin?: string; // 10
  verifyUrl: string; // "https://masjid.id/verify?token=..."
  resendUrl?: string; // "https://masjid.id/otp/resend"
  supportUrl?: string; // "https://masjid.id/support"
  logoUrl?: string; // "https://.../logo.png"
};

export default function OtpEmail({
  appName = "Masjid Digital",
  otp,
  expiresInMin = "1 hari",
  verifyUrl,
  resendUrl = "https://masjid.id/otp/resend",
  supportUrl = "https://masjid.id/support",
  logoUrl,
}: OtpEmailProps) {
  const chars = String(otp).trim().slice(0, 6).padEnd(6, "•").split("");

  return (
    <Html lang="id">
      <Head />
      <Preview>
        Kode OTP {appName} • Berlaku {String(expiresInMin)}
      </Preview>
      <Tailwind>
        <Body className="m-0 bg-slate-100 font-sans text-slate-900">
          <Container className="mx-auto my-6 w-full max-w-[600px] rounded-2xl border border-slate-200 bg-white">
            {/* Header */}
            <Section className="px-6 pt-6">
              <div className="flex items-center gap-3">
                {logoUrl ? (
                  <Img
                    src={logoUrl}
                    width="40"
                    height="40"
                    alt={appName}
                    className="rounded-xl"
                  />
                ) : (
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-900 text-white">
                    م
                  </div>
                )}
                <div>
                  <Text className="m-0 text-sm font-semibold text-slate-900">
                    {appName}
                  </Text>
                  <Text className="m-0 text-xs text-slate-500">
                    Verifikasi Email
                  </Text>
                </div>
              </div>
            </Section>

            {/* Hero */}
            <Section className="px-6 pt-4">
              <div className="rounded-xl p-5 bg-emerald-500">
                <Text className="m-0 mt-1 text-lg font-semibold text-white">
                  Silahkan klik tombol di bawah untuk memverifikasi email Anda.
                </Text>
              </div>
            </Section>

            {/* Body copy */}
            <Section className="px-6 pt-5">
              <Text className="m-0 text-sm leading-6 text-slate-800">
                Assalamu’alaikum. Gunakan kode di bawah ini untuk memverifikasi
                email Anda. Kode berlaku selama <strong>{expiresInMin}</strong>
                .
              </Text>
            </Section>

            {/* OTP boxes */}
            <Section className="px-6 pt-3">
              <Text className="m-0 mt-2 text-3xl font-bold tracking-widest text-slate-900 text-center">
                <span>{otp?.split("")?.join(" ")}</span>
              </Text>
            </Section>

            {/* CTA */}
            <Section className="px-6 pt-3 text-center">
              <Button
                href={verifyUrl}
                className="inline-block rounded-xl bg-emerald-900 px-4 py-2 text-sm font-semibold text-white no-underline"
              >
                Verifikasi Email
              </Button>
            </Section>

            {/* Info */}
            <Section className="px-6 pt-4">
              <Text className="m-0 text-xs leading-6 text-slate-500">
                Jika Anda tidak meminta verifikasi ini, abaikan email ini.
                Jangan bagikan kode kepada siapa pun.
              </Text>
            </Section>

            <Hr className="my-5 h-px border-0 bg-slate-200" />

            {/* Secondary actions */}
            <Section className="px-6 pb-6">
              <Text className="m-0 text-xs leading-6 text-slate-600">
                Tidak menerima kode?{" "}
                <Link href={resendUrl} className="text-emerald-900 underline">
                  Kirim ulang
                </Link>
                .
                <br />
                Atau masukkan kode manual di halaman aplikasi:{" "}
                <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-800">
                  masjid.id/verify
                </span>
                .
              </Text>
              <Text className="mt-3 text-[11px] leading-5 text-slate-400">
                Butuh bantuan?{" "}
                <Link href={supportUrl} className="text-slate-500 underline">
                  Pusat Bantuan
                </Link>
              </Text>
              <Text className="mt-5 text-[11px] text-slate-400">
                © {new Date().getFullYear()} {appName}. Indonesia.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

/** Komponen OTP kotak konsisten */
function OtpBoxes({ value = "" }) {
  const chars = String(value).trim().slice(0, 6).padEnd(6, "•").split("");
  return (
    <table role="presentation" className="mx-auto">
      <tbody>
        <tr>
          {chars.map((c, i) => (
            <td key={i} className="align-middle">
              <div className="mx-1 grid h-14 w-14 place-items-center rounded-xl border border-slate-200 text-lg font-bold text-emerald-900">
                {c}
              </div>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}
