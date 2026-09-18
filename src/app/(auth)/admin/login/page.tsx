"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { loginAction, type ActionState } from "@/features/auth/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { FieldError } from "@/components/shared/field-error";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const initialState: ActionState = {};

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#FBF7EF] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-white rounded-xl shadow-sm border border-marketing-rule/60 p-8 sm:p-10">
        
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.jpg" alt="TLMI Logo" width={48} height={48} className="rounded-sm object-cover mb-4" />
          <h1 className="font-marketing-display text-2xl sm:text-3xl font-semibold text-marketing-ink text-center">
            Admin Portal
          </h1>
          <p className="text-[14px] text-marketing-stone mt-2 text-center">
            Log in to manage The Light Music Institute.
          </p>
        </div>

        {state.error && (
          <Alert variant="danger" className="mb-6 rounded-md">
            {state.error}
          </Alert>
        )}

        <form action={formAction} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[13px] font-medium text-marketing-ink">Admin Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="admin@tlmi.academy"
              autoComplete="email" 
              className="bg-white border-marketing-rule focus:border-marketing-gold focus:ring-marketing-gold rounded-md h-11 text-[15px]" 
              required 
            />
            <FieldError messages={state.fieldErrors?.email} />
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-[13px] font-medium text-marketing-ink">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                className="bg-white border-marketing-rule focus:border-marketing-gold focus:ring-marketing-gold rounded-md h-11 text-[15px] pr-10"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-marketing-stone hover:text-marketing-ink"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </button>
            </div>
            <FieldError messages={state.fieldErrors?.password} />
          </div>

          <Button type="submit" className="w-full bg-[#181412] hover:bg-black text-white h-11 rounded-md text-[15px] font-medium transition-colors mt-4" disabled={isPending}>
            {isPending ? "Logging in…" : "Secure Log in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
