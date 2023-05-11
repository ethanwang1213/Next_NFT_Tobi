type Props = {
  className: string;
};

/**
 * NFT受け取り方法のリンクのコンポーネント
 * @param param0
 * @returns
 */
const HowToLink: React.FC<Props> = ({ className }) => {
  return <p className={className}>How to receive NFTs</p>;
};

export default HowToLink;
