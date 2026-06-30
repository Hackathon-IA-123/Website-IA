import { signIn } from "@/auth";
import DotField from "./DotField";
import Logo from "./Logo";

export default function Login() {
  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden">
      <DotField focus={{ x: 0.5, y: 0.55, rad: 0.45, str: 1 }} theme="dark" />

      <div className="animate-ui-fade-up relative z-10 flex flex-col items-center px-6 text-center">
        <Logo size={84} />
        <h1 className="mt-6 text-[40px] font-light tracking-[-0.02em] text-[#f1f1f1]">
          Jean
        </h1>
        <p className="mt-2 max-w-[360px] text-[16px] text-muted">
          Votre assistant <span className="text-accent">médical</span> et{" "}
          <span className="text-accent">financier</span>. Connectez-vous pour
          retrouver vos conversations.
        </p>

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
          className="mt-10"
        >
          <button
            type="submit"
            className="flex items-center gap-3 rounded-full bg-white px-6 py-3 text-[15px] font-medium text-[#1f1f1f] transition-transform hover:scale-[1.02]"
          >
            <GoogleIcon />
            Continuer avec Google
          </button>
        </form>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}
