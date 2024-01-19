import Image from "next/image";
import Link from "next/link";

export default function CreateButton({
  label,
  href
}: {
  label: string,
  href: string
}) {
  return (
    <Link
      href={href}
      className="flex h-14 px-6 items-center rounded-[30px] bg-[#1779DE] text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <Image
        src="/admin/images/plus-icon.svg"
        alt=""
        width={26}
        height={26}
        className="mr-6"
      />
      <span className="text-xl font-semibold uppercase text-center">
        {label}
      </span>
    </Link>
  );
}
