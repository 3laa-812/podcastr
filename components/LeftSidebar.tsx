"use client";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LeftSidebar = () => {
  const pathName = usePathname();
  const router = useRouter();
  return (
    <section className="sticky left-0 top-0 flex w-fit flex-col justify-between border-none bg-[#15171C] pt-8 max-md:hidden lg:w-[270px] lg:pl-8">
      <nav>
        <Link
          href="/"
          className="flex cursor-pointer items-center gap-1 pb-10 max-lg:justify-center"
        >
          <Image src="/icons/logo.svg" alt="logo" width={23} height={27} />
          <h1 className="text-2xl font-extrabold max-lg:hidden">Podcastr</h1>
        </Link>
        {sidebarLinks.map(({ route, label, imgURL }) => {
          const isActive =
            pathName === route || pathName.startsWith(`${route}/`);
          return (
            <Link
              href={route}
              key={label}
              className={cn(
                "flex gap-3 items-center py-4 max-lg:px-4 lg:justify-start justify-center",
                {
                  "fade-indicator transition-colors duration-150 bg-gradient-to-l from-gray-700 to-[#15171C] border-r-4 border-[#F97535]":
                    isActive,
                }
              )}
            >
              <Image src={imgURL} alt={label} width={24} height={24} />
              <p className="text-lg font-medium">{label}</p>
            </Link>
          );
        })}
      </nav>
    </section>
  );
};

export default LeftSidebar;
