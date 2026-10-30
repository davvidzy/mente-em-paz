import { useEffect, useState, type ReactElement } from "react";
import type { ProfileId } from "../../config/quiz";
import { bonuses, expertPublished, media, program, testimonials } from "../../config/site";
import { trackOnce } from "../../lib/analytics";
import { quizSession } from "../../lib/session";
import { ConsentBanner } from "../ui/ConsentBanner";
import type { Tone } from "./shared";
import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { Identification } from "./sections/Identification";
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

/**
 * Landing Page. O vídeo de apresentação fica dentro do Hero.
 * Seções opcionais sem conteúdo (vídeo, áudio, depoimentos) ficam ocultas em
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

  useEffect(() => {
    setProfile(quizSession.getProfile());
    setExpertPreview(new URLSearchParams(window.location.search).get("previa") === "especialista");
    trackOnce("landing_page_viewed", { content_name: "Mente em Paz" });
  }, []);

  const hasAudio = Boolean(media.audioPreview.src);
  const hasTestimonials = testimonials.length > 0;

  // [visível, render(tone)]
  const sections: [boolean, (tone: Tone) => ReactElement][] = [
    [true, (t) => <Identification key="ident" tone={t} profile={profile} />],
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
        <Hero profile={profile} />
        {sections
          .filter(([visible]) => visible)
          .map(([, render]) => render(i++ % 2 === 0 ? "surface" : "canvas"))}
        <FinalCta />
      </main>
      <Footer />
      <Notice message={notice} onClose={() => setNotice(null)} />
      <ConsentBanner />
    </>
  );
}
