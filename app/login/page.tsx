import { signIn } from "@/lib/auth";
import { CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b1b3a] p-8">
      <Card className="w-full max-w-sm border-none bg-white text-[#0b1b3a]">
        <CardHeader className="items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#b57edc] text-white shadow-md">
            <CheckSquare className="h-7 w-7" />
          </div>
          <CardTitle className="mt-2 text-2xl">Tâchable</CardTitle>
          <p className="text-sm text-gray-500">
            Connectez-vous pour accéder à vos listes
          </p>
        </CardHeader>

        <CardContent>
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <Button
              type="submit"
              className="w-full bg-[#b57edc] hover:bg-[#9b5fc9] text-white"
            >
              Se connecter avec Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
