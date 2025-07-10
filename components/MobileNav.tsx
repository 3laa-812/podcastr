"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileNav = () => {
  const pathName = usePathname();
  return (
    <section>
      <Sheet>
        <SheetTrigger>
          <Image
            src={"/icons/hamburger.svg"}
            alt="menu"
            width={30}
            height={30}
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-[#15171C] p-4">
          <Link
            href="/"
            className="flex cursor-pointer items-center gap-1 pb-10 pl-4"
          >
            <Image src="/icons/logo.svg" alt="logo" width={23} height={27} />
            <h1 className="text-[24px] font-extrabold ml-2">Podcastr</h1>
          </Link>
          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <nav className="flex h-full flex-col">
                {sidebarLinks.map(({ route, label, imgURL }) => {
                  const isActive =
                    pathName === route || pathName.startsWith(`${route}/`);
                  return (
                    <SheetClose asChild key={label}>
                      <Link
                        href={route}
                        className={cn(
                          "flex gap-3 items-center py-4 max-lg:px-4 lg:justify-start",
                          {
                            "fade-indicator transition-colors duration-150 bg-gradient-to-l from-gray-700 to-[#15171C] border-r-4 border-[#F97535]":
                              isActive,
                          }
                        )}
                      >
                        <Image
                          src={imgURL}
                          alt={label}
                          width={24}
                          height={24}
                        />
                        <p className="text-lg font-medium">{label}</p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
