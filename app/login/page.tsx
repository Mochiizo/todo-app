"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setSubmitting(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setSubmitting(false);

    if (!res.ok) {
      toast.error("Mot de passe incorrect.");
      return;
    }

    router.push("/");
    router.refresh();
  };

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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Mot de passe
              </label>
              <Input
                id="password"
                type="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-[#b57edc] focus:ring-[#b57edc]"
              />
            </div>

            <Button
              type="submit"
              disabled={!password || submitting}
              className="w-full bg-[#b57edc] hover:bg-[#9b5fc9] text-white disabled:opacity-50"
            >
              {submitting ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
