import { createGlobalStyle } from 'styled-components'

/**
 * 特定の(contact)ページでのみReCaptchaのバッジを表示する
 */
const RecaptchaVisibleStyle = createGlobalStyle`
  .grecaptcha-badge {
    visibility: visible;
  }
`

export default RecaptchaVisibleStyle