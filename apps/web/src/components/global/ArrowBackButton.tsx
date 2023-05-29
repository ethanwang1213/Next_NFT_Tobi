import { useRouter } from "next/router";

const ArrowBackButton = () => {
  const router = useRouter();
  return (
    <button type="button">
      <a onClick={() => router.back()}>
        <img src="/contact/arrow.webp" />
      </a>
    </button>
  );
};

export default ArrowBackButton;
