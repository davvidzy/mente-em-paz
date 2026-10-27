import { brand } from "../config/site";

/** Link do WhatsApp de suporte com a mensagem já escrita. Vazio = sem WhatsApp configurado. */
export function whatsappUrl(): string {
  const n = brand.whatsapp.replace(/\D/g, "");
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(brand.whatsappMessage)}` : "";
}
