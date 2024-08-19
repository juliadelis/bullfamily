"use client";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";
import image from "../../assets/login-building.png";
import building from "../../assets/background3-01.png";
import Image from "next/image";
import PasswordInput from "./password";

export default async function Login() {
  const signIn = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error);
      return;
    }

    localStorage.setItem("user", JSON.stringify({ data }));

    return redirect("/");
  };

  return (
    <div className=" flex flex-col md:flex-row w-screen  flex-wrap content-center  md:h-screen md:justify-between overflow-hidden">
      <div className="flex-1 w-full h-fit absolute bottom-[5vh] md:bottom-0 md:relative p-6 md:p-0 md:w-[40%] flex flex-col items-center justify-center z-10">
        <form className="animate-in bg-white rounded-lg h-fit p-6 flex-1 flex flex-col w-full max-w-lg justify-center text-foreground">
          <h2 className="text-4xl font-semibold mb-14">
            Bull Family Real Estate Control
          </h2>
          <h2 className="text-2xl  mb-6 md:mb-14">Login</h2>
          <label className=" text-md md:text-xl mb-4" htmlFor="email">
            Email
          </label> 
          <input 
            className="rounded-md px-4 py-4 w-full bg-inherit border mb-8"
            name="email"
            placeholder="you@example.com"
            required
          />
          <label className="text-md md:text-xl mb-4" htmlFor="password">
            Senha
          </label>
          {/* <input
            className="rounded-md px-4 py-4 bg-inherit border mb-8"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          /> */}
          <PasswordInput />
          <SubmitButton
            formAction={signIn}
            className="bg-black hover:bg-gray-900 transition-all ease-in-out  text-white mt-8 rounded-md px-4 py-4 text-foreground "
            pendingText="ENTRANDO...">
            ENTRAR
          </SubmitButton>
        </form>
      </div>
      <Image
        alt="Predio"
        fill
        src={building}
        className="fixed h-screen  object-cover"
      />
      {/* <div className="w-[60%] hidden md:block relative ">
        <Image alt="Predio" fill src={image} />
        <div className="absolute top-[20%] left-2/4 text-center flex gap-1 flex-col translate-x-[-50%] z-50 text-[64px]">
          <p>Bull Family</p>
          <p>Real State</p>
        </div>
      </div> */}
    </div>
  );
}
