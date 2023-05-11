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
    <p className={className}>
      <Link target="_blank" href="https://tobiratory.myshopify.com/pages/faq">
        How to receive NFTs
      </Link>
    </p>
  );
};

export default HowToLink;
