import Link from "next/link";

type Props = {
  className: string;
  text: string;
};

/**
 * redeemページからのサポートページ遷移用ボタン
 * @param param0
 * @returns
 */
const CustomerSupportButton: React.FC<Props> = ({ className, text }) => {
  return (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      href={"https://tobiratory.myshopify.com/pages/faq"}
      className={className}
    >
      {text}
    </Link>
  );
};

export default CustomerSupportButton;
