import { boot } from "./boot";
import { matchesPrerender, QuizApp } from "../components/quiz/QuizApp";

boot(<QuizApp />, matchesPrerender());
