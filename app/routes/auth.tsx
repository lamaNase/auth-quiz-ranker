import { Link, useSearchParams } from "@remix-run/react";
import { FaFacebook, FaGoogle, FaTelegram } from "react-icons/fa";
import LogoSide from "~/components/headers/logoSide";
import "~/styles/auth.css";

export function meta({ location }) {
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get("mode") || "login";

  return [
    {
      title: mode === "signup" ? "إنشاء حساب جديد" : "تسجيل الدخول",
    },
    {
      name: "description",
      content:
        mode === "signup"
          ? "أنشئ حسابك باستخدام رقم الهاتف أو عبر تيليغرام، جوجل، أو فيسبوك."
          : "سجّل الدخول إلى حسابك بسهولة باستخدام رقم الهاتف أو حسابات التواصل الاجتماعي.",
    },
  ];
}

export default function AuthunticationPage() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "login";

  console.log(mode);
  return (
    <main className="auth-page">
      <section className="login-signup">
        <nav id="auth-nav">
          <Link to="?mode=login" className={mode === "login" ? "active" : ""}>تسجيل الدخول</Link>
          <Link to="?mode=signup" className={mode === "signup" ? "active" : ""}>انشاء حساب</Link>
        </nav>
        <ul id="auth-options">
          <li><Link to="/">
            < FaTelegram />
            <span
            >{mode === "signup" ? "إنشاء حساب" : "الدخول"} من خلال تيليغرام
            </span>
          </Link></li>
          <li><Link to="/">
            < FaGoogle />
            <span>
              {mode === "signup" ? "إنشاء حساب" : "الدخول"} من خلال جوجل
            </span>
          </Link></li>
          <li><Link to="/">
            < FaFacebook />
            <span>
              {mode === "signup" ? "إنشاء حساب" : "الدخول"} من خلال فيسبوك
            </span>
          </Link></li>
          <p>أو</p>
          <li><Link to={"/register-phone-number" + "?mode=" + mode}>
            <span>
              {mode === "signup" ? "إنشاء حساب" : "الدخول"} من خلال رقم الهاتف
            </span>
          </Link></li>
        </ul>
      </section>
      < LogoSide parag={mode} />
    </main>
  );
}
