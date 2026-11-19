import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { isInstitutionalGoogleAccount } from "@/lib/institutional-auth";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      authorization: { params: { hd: process.env.INSTITUTION_DOMAIN } },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (!account || account.provider !== "google") return false;
      if (profile?.email_verified !== true) return false;

      const email = profile?.email?.toLowerCase();
      const domain = process.env.INSTITUTION_DOMAIN?.toLowerCase();
      const verifiedDomain = typeof profile?.hd === "string" ? profile.hd : undefined;
      if (!isInstitutionalGoogleAccount(email, verifiedDomain, domain, profile?.email_verified)) return false;

      const user = await prisma.user.findUnique({
        where: { email },
        include: { roles: { include: { role: true } } },
      });
      if (!user || user.status !== "ACTIVE") return false;

      await prisma.user.update({
        where: { id: user.id },
        data: { googleSubject: account.providerAccountId, lastAccessAt: new Date() },
      });
      return true;
    },
  },
});
