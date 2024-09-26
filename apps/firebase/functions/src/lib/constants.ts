import {Tpf2023StampType} from "types/journal-types";

export const NEKO_NFT_ID =
  process.env.NEKO_NFT_ADDRESS || "A.5e9ccdb91ff7ad93.TobiraNeko"; // default for testnet
export const TOPIC_NAMES = {
  ordersPaid: "shopify-orders-paid",
  ordersCreate: "shopify-orders-create",
  flowTxSend: "flow-tx-send",
  flowTxMonitor: "flow-tx-monitor",
};

export const REGION = process.env.REGION || "asia-northeast1";

export const IMAGE_HOST =
  process.env.IMAGE_HOST || "https://storage.googleapis.com/tobiratory-media";
export const SITE_HOST = process.env.SITE_HOST || "https://www.tobiratory.com";

export const SLACK_WEBHOOK_URL_FOR_ORDERS_CREATE =
  process.env.SLACK_WEBHOOK_URL_FOR_ORDERS_CREATE || "";

export const TPF2023_STAMP_RALLY_KEYWORDS: {
  [key in Tpf2023StampType]: string;
} = {
  G0: "Ca00",
  G1alpha: "pe03",
  G1beta: "ia04",
  G1gamma: "io02",
  G1delta: "ss01",
};

export const NON_FUNGIBLE_TOKEN_ADDRESS =
    process.env.FLOW_NETWORK === "mainnet" ? "1d7e57aa55817448" :
        process.env.FLOW_NETWORK === "testnet" ? "631e88ae7f1d7c20" :
            "f8d6e0586b0a20c7";

export const TOBIRATORY_DIGITAL_ITEMS_ADDRESS =
    process.env.FLOW_NETWORK === "mainnet" ? "TODO" :
        process.env.FLOW_NETWORK === "testnet" ? "5e9ccdb91ff7ad93" :
            "f8d6e0586b0a20c7";

export const FUNGIBLE_TOKEN_ADDRESS =
    process.env.FLOW_NETWORK === "mainnet" ? "f233dcee88fe0abe" :
        process.env.FLOW_NETWORK === "testnet" ? "9a0766d93b6608b7" :
            "ee82856bf20e2aa6";

export const REDEEM_LINK_CODE_EXPIRATION_TIME = 1000 * 60 * 60 * 24;

/* eslint-disable max-len, no-irregular-whitespace */
export const MAIL_HEAD = `
<!DOCTYPE html>

<html lang="ja-JP" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<title></title>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
<style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
    }

    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: inherit !important;
    }

    #MessageViewBody a {
      color: inherit;
      text-decoration: none;
    }

    p {
      line-height: inherit
    }

    .desktop_hide,
    .desktop_hide table {
      mso-hide: all;
      display: none;
      max-height: 0px;
      overflow: hidden;
    }

    .image_block img+div {
      display: none;
    }

    @media (max-width:660px) {
      .social_block.desktop_hide .social-table {
        display: inline-block !important;
      }

      .fullMobileWidth,
      .image_block img.big,
      .row-content {
        width: 100% !important;
      }

      .mobile_hide {
        display: none;
      }

      .stack .column {
        width: 100%;
        display: block;
      }

      .mobile_hide {
        min-height: 0;
        max-height: 0;
        max-width: 0;
        overflow: hidden;
        font-size: 0px;
      }

      .desktop_hide,
      .desktop_hide table {
        display: table !important;
        max-height: none !important;
      }
    }
  </style>
</head>
<body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
<table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #be6105;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-position: center top; color: #000000; background-image: url('images/blue-glow_3.jpg'); background-repeat: no-repeat; width: 640px;" width="640">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-bottom:35px;padding-left:30px;padding-right:30px;padding-top:35px;width:100%;">
<div align="center" class="alignment" style="line-height:10px"><a href="${SITE_HOST}" style="outline:none" tabindex="-1" target="_blank"><img alt="tobiratory_logo" class="fullMobileWidth" src="${IMAGE_HOST}/images/TBR_Hrz_WH.png" style="display: block; height: auto; border: 0; width: 256px; max-width: 100%;" title="tobiratory_logo" width="256"/></a></div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="image_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
<div align="center" class="alignment" style="line-height:10px"><img class="fullMobileWidth" src="${IMAGE_HOST}/images/top-rounded.png" style="display: block; height: auto; border: 0; width: 640px; max-width: 100%;" width="640"/></div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #be6105;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; background-position: center top; color: #000000; width: 640px;" width="640">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 10px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
<div align="center" class="alignment" style="line-height:10px"><img alt="Journalbook" src="${IMAGE_HOST}/images/Journal_book_TOBIRAPOLIS_2.png" style="display: block; height: auto; border: 0; width: 256px; max-width: 100%;" title="Journalbook" width="256"/></div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #be6105; background-size: auto;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto; background-color: #ffffff; color: #000000; width: 640px;" width="640">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-bottom:5px;padding-top:25px;text-align:center;width:100%;">
<h1 style="margin: 0; color: #7d5337; direction: ltr; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 36px; font-weight: normal; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><strong>引き換えコード</strong></h1>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="text_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-bottom:20px;padding-left:30px;padding-right:30px;padding-top:20px;">
<div style="font-family: sans-serif">
<div class="" style="font-size: 14px; font-family: ヒラギノ角ゴ Pro W3, Hiragino Kaku Gothic Pro,Osaka, メイリオ, Meiryo, ＭＳ Ｐゴシック, MS PGothic, sans-serif; mso-line-height-alt: 25.2px; color: #737487; line-height: 1.8;">
`;

export const MAIL_FOOT = `
</div>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="button_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-bottom:30px;padding-left:15px;padding-right:15px;padding-top:20px;text-align:center;">
<div align="center" class="alignment"><!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${SITE_HOST}/login" style="height:52px;width:264px;v-text-anchor:middle;" arcsize="8%" stroke="false" fillcolor="#7d5337"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:sans-serif; font-size:16px"><![endif]--><a href="${SITE_HOST}/login" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#7d5337;border-radius:4px;width:auto;border-top:0px solid transparent;font-weight:400;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:10px;padding-bottom:10px;font-family:ヒラギノ角ゴ Pro W3, Hiragino Kaku Gothic Pro,Osaka, メイリオ, Meiryo, ＭＳ Ｐゴシック, MS PGothic, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;" target="_blank"><span style="padding-left:60px;padding-right:60px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;">早速引き換えよう！</span></span></a><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #be6105;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 640px;" width="640">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="10" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<div align="center" class="alignment">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span> </span></td>
</tr>
</table>
</div>
</td>
</tr>
</table>
<div class="spacer_block block-2" style="height:30px;line-height:30px;font-size:1px;"> </div>
<table border="0" cellpadding="0" cellspacing="0" class="image_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-bottom:5px;padding-left:20px;padding-right:20px;padding-top:5px;width:100%;">
<div align="center" class="alignment" style="line-height:10px"><img alt="Journal_logo" src="${IMAGE_HOST}/images/Logo_TOBIRAPOLIS_1.png" style="display: block; height: auto; border: 0; width: 192px; max-width: 100%;" title="Journal_logo" width="192"/></div>
</td>
</tr>
</table>
<table border="0" cellpadding="20" cellspacing="0" class="text_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad">
<div style="font-family: sans-serif">
<div class="" style="font-size: 14px; font-family: ヒラギノ角ゴ Pro W3, Hiragino Kaku Gothic Pro,Osaka, メイリオ, Meiryo, ＭＳ Ｐゴシック, MS PGothic, sans-serif; mso-line-height-alt: 25.2px; color: #7d5337; line-height: 1.8;">
<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 25.2px;"><strong><span style="font-size:18px;">TOBIRA NEKOを表示するには</span></strong></p>
<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 25.2px;"><span style="font-size:14px;">Journal（ジャーナル）のメールアドレスと購入時のメールアドレスが同一である必要がございます。ご注意ください。</span></p>
</div>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="button_block block-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-bottom:30px;padding-left:15px;padding-right:15px;padding-top:20px;text-align:center;">
<div align="center" class="alignment"><!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://tobiratory.myshopify.com/pages/contact" style="height:68px;width:240px;v-text-anchor:middle;" arcsize="6%" stroke="false" fillcolor="#7d5337"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:sans-serif; font-size:12px"><![endif]--><a href="https://tobiratory.myshopify.com/pages/contact" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#7d5337;border-radius:4px;width:auto;border-top:0px solid transparent;font-weight:400;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:10px;padding-bottom:10px;font-family:ヒラギノ角ゴ Pro W3, Hiragino Kaku Gothic Pro,Osaka, メイリオ, Meiryo, ＭＳ Ｐゴシック, MS PGothic, sans-serif;font-size:12px;text-align:center;mso-border-alt:none;word-break:keep-all;" target="_blank"><span style="padding-left:60px;padding-right:60px;font-size:12px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 24px;">引き換えに関する<br/>お問い合わせはこちら</span></span></a><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="image_block block-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-bottom:35px;padding-top:10px;width:100%;padding-right:0px;padding-left:0px;">
<div align="center" class="alignment" style="line-height:10px"><img class="big" src="${IMAGE_HOST}/images/divider.png" style="display: block; height: auto; border: 0; width: 541px; max-width: 100%;" width="541"/></div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="text_block block-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad">
<div style="font-family: sans-serif">
<div class="" style="font-size: 14px; font-family: ヒラギノ角ゴ Pro W3, Hiragino Kaku Gothic Pro,Osaka, メイリオ, Meiryo, ＭＳ Ｐゴシック, MS PGothic, sans-serif; mso-line-height-alt: 25.2px; color: #7d5337; line-height: 1.8;">
<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 32.4px;"><span style="font-size:18px;">#Tobiratory をフォローしよう！</span></p>
</div>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="social_block block-8" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-bottom:15px;padding-left:15px;padding-right:15px;padding-top:10px;text-align:center;">
<div align="center" class="alignment">
<table border="0" cellpadding="0" cellspacing="0" class="social-table" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;" width="46px">
<tr>
<td style="padding:0 7px 0 7px;"><a href="https://twitter.com/Tobiratory" target="_blank"><img alt="Twitter" height="32" src="${IMAGE_HOST}/images/twitter2x.png" style="display: block; height: auto; border: 0;" title="Twitter" width="32"/></a></td>
</tr>
</table>
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #be6105;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-position: center top; color: #000000; width: 640px;" width="640">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
<div align="center" class="alignment" style="line-height:10px"><img class="fullMobileWidth" src="${IMAGE_HOST}/images/bottom-rounded.png" style="display: block; height: auto; border: 0; width: 640px; max-width: 100%;" width="640"/></div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="text_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-bottom:5px;padding-left:5px;padding-right:5px;padding-top:30px;">
<div style="font-family: sans-serif">
<div class="" style="font-size: 12px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #f0e8e1; line-height: 1.2;">
<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;"><span style="font-size:12px;">©Tobiratory</span></p>
</div>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="text_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-bottom:35px;padding-left:10px;padding-right:10px;padding-top:5px;">
<div style="font-family: sans-serif">
<div class="" style="font-size: 12px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #f0e8e1; line-height: 1.2;">
<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;">Tobiraotory Inc.</p>
</div>
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 640px;" width="640">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="icons_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
<table align="center" cellpadding="0" cellspacing="0" class="alignment" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
<tr>
<td style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 6px;"><img align="center" class="icon" height="32" src="${IMAGE_HOST}/images/TBR_Vrt_BK.png" style="display: block; height: auto; margin: 0 auto; border: 0;" width="31"/></td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table><!-- End -->
</body>
</html>
`;

export const resetLimitTransactionDuration = 1 * 24 * 60 * 60 * 1000;
export const numberOfLimitTransaction = 1000;
export const resetLimitTransactionTime = 5;
export const timeoutTime = 300;
export const vpcName = "projects/tobiratory-f6ae1/locations/asia-northeast1/connectors/tobiratory-app";
export const limitModelSize = 15; // this is limit of uploaded model size. 15MB
export const allCharacter = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
