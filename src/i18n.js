import i18next from "i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const apiKey = "JyQtLB-me5Hp6VIcgnfiDQ";
const loadPath = `https://api.i18nexus.com/project_resources/translations/{{lng}}/{{ns}}.json?api_key=${apiKey}`;

i18next
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",

    ns: ["default"],
    defaultNS: "default",

    supportedLngs: ["en","af","he","gu","sq","hy","ay","az","bm","eu","ceb","hr","cs","dv","nl","es","hi","vi","de","am","doi","ar","bn","bho","ca","as","bs","bg","eo","et","be","my","ny","co","zh","da"],
    
    backend: {
      loadPath: loadPath
    }
  })