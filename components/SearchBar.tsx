"use client";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useDebounce } from "@/lib/useDebounce";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const pathName = usePathname();

  const debounceValue = useDebounce(search, 500);

  useEffect(() => {
    if (debounceValue) router.push(`/discover?search=${debounceValue}`);
    else if (!debounceValue && pathName === "/discover") router.push("/discover");
  }, [router, pathName, debounceValue]);

  return (
    <div className="relative mt-8 block">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for podcasts"
        className="focus-visible:ring-offset-[#F97535] py-6 pl-12 text-[16px] placeholder:text-[16px] bg-[#15171C] rounded-[6px] placeholder:text-[#71788B] border-none text[#71788B]"
      />
      <Image
        src={"/icons/search.svg"}
        alt="search"
        height={20}
        width={20}
        className="absolute left-4 top-3.5"
      />
    </div>
  );
};

export default SearchBar;
