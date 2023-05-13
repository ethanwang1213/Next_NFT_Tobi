import Link from "next/link";

type Props = {
  className: string;
};

/**
 * NFT受け取り方法のリンクのコンポーネント
 * @param param0
 * @returns
 */
const HowToLink: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <Link
        target="_blank"
        href="https://tobiratory.myshopify.com/pages/faq"
        className="link link-info"
      >
        How to receive NFTs
      </Link>
    </div>
  );
};

export default HowToLink;
