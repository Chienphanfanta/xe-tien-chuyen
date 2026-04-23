"use client";

import { Loader2 } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginAction, type LoginState } from "./actions";

const INITIAL_STATE: LoginState = { error: null };

export function LoginForm({ nextPath }: { nextPath: string | null }) {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {nextPath && <input type="hidden" name="next" value={nextPath} />}

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="taixe@example.com"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="current-password"
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="mt-2 h-11 w-full text-base"
      >
        {isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        Đăng nhập
      </Button>
    </form>
  );
}
