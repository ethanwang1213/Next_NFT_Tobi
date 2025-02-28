import {
  flowAccountCreationBody as flowAccountCreationBodyEn,
  flowAccountCreationSubject as flowAccountCreationSubjectEn,
} from "./template/en";
import {
  flowAccountCreationBody as flowAccountCreationBodyJa,
  flowAccountCreationSubject as flowAccountCreationSubjectJa,
} from "./template/ja";

export const flowAccountCreationMail = {
  ja: {
    subject: flowAccountCreationSubjectJa,
    body: flowAccountCreationBodyJa,
  },
  en: {
    subject: flowAccountCreationSubjectEn,
    body: flowAccountCreationBodyEn,
  },
};

export const defaultNames = {
  ja: "お客",
  en: "Customer",
};

export const createFlowAccountCreationMail = (
    name?: string,
    locale?: string,
) => {
  const newLocale = isLocale(locale) ? locale : "ja";
  const newName = name ?? defaultNames[newLocale];
  const mailData = flowAccountCreationMail[newLocale];
  const body = mailData.body.replace("__NAME__", newName);
  return {subject: mailData.subject, body};
};

export const isLocale = (locale?: string): locale is "ja" | "en" => {
  return locale === "ja" || locale === "en";
};
