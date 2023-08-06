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
      <div className="h-full align-bottom align-text-bottom ">
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://tobiratory.myshopify.com/pages/faq"
          className="link link-info w-full absolute bottom-0 right-0"
        >
          NFTを引き換えるには？
        </Link>
      </div>
    </div>
  );
};

export default HowToLink;
