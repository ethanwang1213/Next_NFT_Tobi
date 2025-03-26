import { getValidLocale, Locale, shouldUseJaLocale } from "types/localeTypes";

export const getMessages = async (locale: string) => {
  const validLocale = getValidLocale(locale);
  const newLocale = shouldUseJaLocale(validLocale) ? Locale.JA : validLocale;
  const account = (await import(`/messages/${newLocale}/account.json`)).default;
  const content = (await import(`/messages/${newLocale}/content.json`)).default;
  const date = (await import(`/messages/${newLocale}/date.json`)).default;
  const error = (await import(`/messages/${newLocale}/error.json`)).default;
  const firebaseAuth = await import(
    `/messages/${newLocale}/firebase_auth.json`
  );
  const firebaseStorage = await import(
    `/messages/${newLocale}/firebase_storage.json`
  );
  const gift = (await import(`/messages/${newLocale}/gift.json`)).default;
  const item = (await import(`/messages/${newLocale}/item.json`)).default;
  const license = (await import(`/messages/${newLocale}/license.json`)).default;
  const logInSignUp = (
    await import(`/messages/${newLocale}/log_in_sign_up.json`)
  ).default;
  const showcase = (await import(`/messages/${newLocale}/showcase.json`))
    .default;
  const tcp = (await import(`/messages/${newLocale}/tcp.json`)).default;
  const ui = (await import(`/messages/${newLocale}/ui.json`)).default;
  const workspace = (await import(`/messages/${newLocale}/workspace.json`))
    .default;
  const unity = (await import(`/messages/${newLocale}/unity.json`)).default;

  return {
    ...account,
    ...content,
    ...date,
    ...error,
    ...firebaseAuth,
    ...firebaseStorage,
    ...gift,
    ...item,
    ...license,
    ...logInSignUp,
    ...showcase,
    ...tcp,
    ...ui,
    ...workspace,
    ...unity,
  };
};
