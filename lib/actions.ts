"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAccess(formData: FormData) {
  "use server";

  const password = formData.get("password");
  if (password !== process.env.PASSWORD) {
    return { error: "Invalid password" };
  }

  cookies().set(
    "call_sim_login",
    Buffer.from(password as string).toString("base64")
  );
  return { success: true };
}
