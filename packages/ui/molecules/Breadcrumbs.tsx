import Image from "next/image";
import { clsx } from "clsx";
import Link from "next/link";

interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

export default function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[];
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex">
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={breadcrumb.href}
            aria-current={breadcrumb.active}
            className={clsx("flex items-center")}
          >
            <Link
              href={breadcrumb.href}
              className={clsx(
                "text-3xl",
                breadcrumb.active ? "text-[#717171]" : "text-[#1779DE]"
              )}
            >
              {breadcrumb.label}
            </Link>
            {index < breadcrumbs.length - 1 ? (
              <Image
                className="ml-4 mr-2"
                width={8}
                height={16}
                src="/admin/images/right-arrow.svg"
                alt="arrow"
              />
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
