export const getMessages = async (locale: string) => {
  const account = (await import(`/messages/${locale}/account.json`)).default;
  const content = (await import(`/messages/${locale}/content.json`)).default;
  const date = (await import(`/messages/${locale}/date.json`)).default;
  const error = (await import(`/messages/${locale}/error.json`)).default;
  const firebaseAuth = (await import(`/messages/${locale}/firebase_auth.json`))
  const firebaseStorage = (await import(`/messages/${locale}/firebase_storage.json`))
  const gift = (await import(`/messages/${locale}/gift.json`)).default;
  const item = (await import(`/messages/${locale}/item.json`)).default;
  const license = (await import(`/messages/${locale}/license.json`)).default;
  const logInSignUp = (await import(`/messages/${locale}/log_in_sign_up.json`))
    .default;
  const showcase = (await import(`/messages/${locale}/showcase.json`)).default;
  const tcp = (await import(`/messages/${locale}/tcp.json`)).default;
  const ui = (await import(`/messages/${locale}/ui.json`)).default;
  const workspace = (await import(`/messages/${locale}/workspace.json`))
    .default;

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
  };
};
