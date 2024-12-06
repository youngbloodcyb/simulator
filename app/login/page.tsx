"use client";

import { Main, Section, Container } from "@/components/craft";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginAccess } from "@/lib/actions";
import { toast } from "sonner";

export default function Page() {
  async function handleLogin(formData: FormData) {
    const result = await loginAccess(formData);
    if (result.error) {
      toast.error(result.error);
    } else {
      window.location.href = "/";
    }
  }

  return (
    <Main>
      <Section>
        <Container className="border border-gray-200 rounded-lg p-4 shadow-sm max-w-xl">
          {/* @ts-expect-error - what? */}
          <form action={handleLogin} className="flex flex-col gap-2">
            <Input
              type="password"
              name="password"
              required
              placeholder="Password"
            />
            <Button type="submit">Login</Button>
          </form>
        </Container>
      </Section>
    </Main>
  );
}
