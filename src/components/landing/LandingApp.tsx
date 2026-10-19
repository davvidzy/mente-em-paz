import { useEffect, useState, type ReactElement } from "react";
import { expert, media, testimonials } from "../../config/site";
import { trackOnce } from "../../lib/analytics";
import { quizSession } from "../../lib/session";
import { ConsentBanner } from "../ui/ConsentBanner";
import type { Tone } from "./shared";
import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { Identification } from "./sections/Identification";
import { Product } from "./sections/Product";
import { AudioDemo } from "./sections/AudioDemo";
import { Expert } from "./sections/Expert";
import { BonusSlot } from "./sections/BonusSlot";
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
  const profile = quizSession.getProfile();
  const [notice, setNotice] = useState<NoticeMessage | null>(null);

  useEffect(() => {
    trackOnce("landing_page_viewed", { content_name: "Mente em Paz" });
  }, []);

  const hasAudio = Boolean(media.audioPreview.src);
  const hasTestimonials = testimonials.length > 0;

  // [visível, render(tone)]
  const sections: [boolean, (tone: Tone) => ReactElement][] = [
    [true, (t) => <Identification key="ident" tone={t} />],
    [true, (t) => <Product key="product" tone={t} />],
    [hasAudio || DEV, (t) => <AudioDemo key="audio" tone={t} />],
    [expert.verified || DEV, (t) => <Expert key="expert" tone={t} />], // só publica com dados confirmados
    [DEV, (t) => <BonusSlot key="bonus" tone={t} />], // espaço reservado — nova seção de bônus
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
      <main id="conteudo">
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
