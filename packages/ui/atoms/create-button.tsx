import Image from 'next/image';
import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function CreateButton({
  linkAddress, buttonLabel
}: {
  linkAddress: string,
  buttonLabel: string
}) {
  return (
    <Link
      href={linkAddress}
      className="flex pl-5 pr-7 h-14 items-center justify-center rounded-[30px] bg-[#1779DE] text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <Image src="/admin/images/plus-icon.svg" alt="" width={26} height={26} className="mr-4" />
      <span className="text-xl font-semibold mt-1">{buttonLabel}</span>{' '}
    </Link>
  );
}
