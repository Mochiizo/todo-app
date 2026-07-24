import { signIn } from "@/lib/auth";
import { CheckSquare } from "lucide-react";
import DecorativeFlower from "@/components/decorative-flower";
import GoogleLogo from "@/components/google-logo";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b1b3a] p-8">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#b57edc] opacity-20 blur-3xl" />

      {/* Floating flowers */}
      <DecorativeFlower
        color="#b57edc"
        className="pointer-events-none absolute top-10 left-10 h-20 w-20 -rotate-12 opacity-20"
      />
      <DecorativeFlower
        color="#e9ddf7"
        className="pointer-events-none absolute right-16 bottom-16 h-24 w-24 rotate-[25deg] opacity-20"
      />

      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border-none bg-[#fdfbf5] p-10 text-center text-[#0b1b3a] shadow-2xl">
        <DecorativeFlower
          color="#b57edc"
          className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rotate-[15deg] opacity-20"
        />
        <DecorativeFlower
          color="#e9ddf7"
          className="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 -rotate-[10deg] opacity-30"
        />

        <div className="relative">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#b57edc] text-white shadow-md">
            <CheckSquare className="h-9 w-9" />
          </div>

          <h1 className="font-heading mt-5 text-3xl font-extrabold">
            Tâchable
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Vos listes, vos rendez-vous et vos notes, réunis dans un seul
            espace, joliment organisé.
          </p>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
            className="mt-8"
          >
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-[#0b1b3a] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <GoogleLogo className="h-5 w-5" />
              Continuer avec Google
            </button>
          </form>

          <p className="mt-6 text-xs text-gray-400">
            Chaque compte Google dispose de son propre espace, privé et
            isolé.
          </p>
        </div>
      </div>
    </div>
  );
}
