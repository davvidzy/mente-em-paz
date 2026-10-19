import { boot } from "./boot";
import { LegalPage } from "../components/legal/LegalPage";

boot(<LegalPage page={document.documentElement.dataset.page === "terms" ? "terms" : "privacy"} />);
