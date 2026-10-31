import { useEffect, useState, type ReactElement } from "react";
import type { ProfileId } from "../../config/quiz";
import { bonuses, coupon, expertPublished, media, program, publishedTestimonials } from "../../config/site";
import { trackOnce } from "../../lib/analytics";
import { quizSession } from "../../lib/session";
import { read, write } from "../../lib/storage";
import { useCountdown } from "../../hooks/useCountdown";
import { CouponButton, CouponWheel } from "./Coupon";
import { ConsentBanner } from "../ui/ConsentBanner";
import type { Tone } from "./shared";
import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { Identification } from "./sections/Identification";
import { Difference } from "./sections/Difference";
import { Product } from "./sections/Product";
import { AudioDemo } from "./sections/AudioDemo";
import { Program } from "./sections/Program";
import { Expert } from "./sections/Expert";
import { Bonus } from "./sections/Bonus";
import { Testimonials } from "./sections/Testimonials";
import { Plans } from "./sections/Plans";
import { Guarantee } from "./sections/Guarantee";
import { Faq } from "./sections/Faq";
import { FinalCta } from "./sections/FinalCta";
import { Footer } from "./sections/Footer";
import { Notice, type NoticeMessage } from "./Notice";

const DEV = import.meta.env.DEV;
const WHEEL_SEEN = "mp_coupon_wheel_seen";
const COUPON_WON = "mp_coupon_won";

/**
 * Landing Page. O mockup do portal fica dentro do Hero.
 * Seções opcionais sem conteúdo (áudio, depoimentos) ficam ocultas em
 * produção; em desenvolvimento mostram placeholder identificado.
 * O fundo alterna automaticamente entre as seções visíveis.
 */
export function LandingApp() {
  // O HTML vem pré-renderizado sem perfil; a frase de acolhimento entra após a hidratação.
  const [profile, setProfile] = useState<ProfileId | null>(null);
  const [notice, setNotice] = useState<NoticeMessage | null>(null);
  // Prévia para aprovação (?previa=especialista): mostra a seção ainda não publicada
  // só para quem tem o link. Lida após a hidratação (o HTML pré-renderizado não a inclui).
  const [expertPreview, setExpertPreview] = useState(false);

  // Roleta de cupom: abre após `coupon.delaySeconds`. Fora da fase de teste, uma vez por
  // visitante e o cupom ganho fica salvo (botão flutuante reabre). Em teste, nada é salvo.
  const [wheelOpen, setWheelOpen] = useState(false);
  // fim do prazo do cupom ganho (ms); null = ainda não ganhou
  const [couponEnds, setCouponEnds] = useState<number | null>(null);
  const couponLeft = useCountdown(couponEnds);

  useEffect(() => {
    setProfile(quizSession.getProfile());
    setExpertPreview(new URLSearchParams(window.location.search).get("previa") === "especialista");
    trackOnce("landing_page_viewed", { content_name: "Mente em Paz" });
  }, []);

  useEffect(() => {
    if (!coupon.enabled) return;
    if (!coupon.testMode) {
      const ends = read<unknown>(COUPON_WON, "local");
      setCouponEnds(typeof ends === "number" ? ends : null); // versões antigas guardavam `true`
    }
    // "já vista" também é lido na fase de teste: é assim que os testes automáticos a pulam
    if (read<boolean>(WHEEL_SEEN, "local")) return;
    const timer = window.setTimeout(() => {
      if (!coupon.testMode) write(WHEEL_SEEN, true, "local");
      setWheelOpen(true);
    }, coupon.delaySeconds * 1000);
    return () => window.clearTimeout(timer);
  }, []);

  const winCoupon = () => {
    const ends = Date.now() + coupon.validMinutes * 60_000;
    if (!coupon.testMode) write(COUPON_WON, ends, "local");
    setCouponEnds(ends);
  };

  const hasAudio = Boolean(media.audioPreview.src);
  const hasTestimonials = publishedTestimonials.length > 0;

  // [visível, render(tone)]
  const sections: [boolean, (tone: Tone) => ReactElement][] = [
    [true, (t) => <Identification key="ident" tone={t} profile={profile} />],
    [true, (t) => <Difference key="difference" tone={t} />],
    [true, (t) => <Product key="product" tone={t} />],
    [hasAudio || DEV, (t) => <AudioDemo key="audio" tone={t} />],
    [expertPublished || expertPreview || DEV, (t) => <Expert key="expert" tone={t} />], // só publica com expert.verified
    [program.nights.length > 0, (t) => <Program key="program" tone={t} />],
    [bonuses.items.length > 0, (t) => <Bonus key="bonus" tone={t} />],
    [hasTestimonials || DEV, (t) => <Testimonials key="test" tone={t} />],
    [true, (t) => <Plans key="plans" tone={t} onNotice={setNotice} />],
    [true, (t) => <Guarantee key="guarantee" tone={t} />],
    [true, (t) => <Faq key="faq" tone={t} />],
  ];

  let i = 0;
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only z-50 rounded-lg bg-brand px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        {sections
          .filter(([visible]) => visible)
          .map(([, render]) => render(i++ % 2 === 0 ? "surface" : "canvas"))}
        <FinalCta />
      </main>
      <Footer />
      <Notice message={notice} onClose={() => setNotice(null)} />
      {coupon.enabled && (
        <CouponWheel open={wheelOpen} expiresAt={couponEnds} onClose={() => setWheelOpen(false)} onWin={winCoupon} />
      )}
      {coupon.enabled && couponEnds !== null && couponLeft !== 0 && !wheelOpen && <CouponButton onClick={() => setWheelOpen(true)} />}
      <ConsentBanner />
    </>
  );
}
