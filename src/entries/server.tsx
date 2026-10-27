import { StrictMode, type ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { LandingApp } from "../components/landing/LandingApp";
import { QuizApp } from "../components/quiz/QuizApp";
import { bonuses, checkout } from "../config/site";

/**
 * Pré-render no build (scripts/prerender.mjs): o HTML já chega com o conteúdo, e o
 * JavaScript só "liga" a página (hydrate). Em rede lenta a visitante lê a oferta — e vê
 * a primeira pergunta do quiz — segundos antes de o JavaScript terminar de carregar.
 */
const render = (app: ReactNode) => renderToString(<StrictMode>{app}</StrictMode>);

export const renderLanding = () => render(<LandingApp />);
/** Primeira pergunta, sem respostas (estado de quem chega pelo anúncio). */
export const renderQuiz = () => render(<QuizApp />);

/**
 * Script inline logo após o conteúdo da landing. Roda assim que o HTML chega — antes do
 * JavaScript do site, que em 3G leva até ~15 s:
 * • prazo dos bônus: troca a data do build pela de hoje + N (ver Bonus.tsx);
 * • botões de compra (já são links para o checkout): acrescenta os parâmetros da campanha
 *   (da URL ou guardados pelo quiz) — quem compra antes da hidratação não perde a origem.
 */
export const landingInlineScript = () =>
  `(function(){var p=function(n){return(n<10?"0":"")+n},d=new Date();d.setDate(d.getDate()+${bonuses.deadlineDaysAhead});` +
  `document.querySelectorAll("[data-deadline]").forEach(function(e){e.textContent=p(d.getDate())+"/"+p(d.getMonth()+1)});` +
  `var k=${JSON.stringify(checkout.forwardQueryParams)},q=new URLSearchParams(location.search),s={};` +
  `try{s=JSON.parse(sessionStorage.getItem("mp_params")||"{}")||{}}catch(e){}` +
  `document.querySelectorAll("#planos a[data-plan]").forEach(function(a){var u=new URL(a.href);` +
  `k.forEach(function(n){var v=q.get(n)||s[n];if(v&&!u.searchParams.has(n))u.searchParams.set(n,v)});a.href=u.toString()})})()`;
