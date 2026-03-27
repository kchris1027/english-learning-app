import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <GraduationCap className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl">Welcome to EnglishPro</CardTitle>
        <CardDescription>
          Authentication coming soon. For now, you&apos;re automatically logged in.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Link href="/dashboard">
          <Button className="w-full">Go to Dashboard</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
