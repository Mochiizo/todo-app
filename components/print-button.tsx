"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrintButton() {
  return (
    <Button
      onClick={() => window.print()}
      variant="ghost"
      className="text-white/70 hover:bg-white/10 hover:text-white"
    >
      <Printer className="mr-2 h-4 w-4" />
      Imprimer
    </Button>
  );
}
