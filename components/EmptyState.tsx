import { EmptyStateProps } from "@/types";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const EmptyState = ({
  title,
  buttonLink,
  buttonText,
  search,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center size-full  gap-3">
      <Image
        src="/icons/emptyState.svg"
        width={300}
        height={300}
        alt="empty state"
      />
      <div className="flex items-center flex-col justify-center w-full max-w-[254px]">
        {title}
        {search && (
          <span className="text-[15px] text-center font-medium text-[#FFFFFFB8]">
            {" "}
            Try adjusting your search to find what you are looking for
          </span>
        )}
        {buttonLink && (
          <Button className="bg-[#F97535] hover:bg-[#F97535]">
            <Link href={buttonLink} className="flex gap-2">
              <Image
                src="/icons/discover.svg"
                width={20}
                height={20}
                alt="discover"
              />
              <p className="text-white font-extrabold text-[15px]">{buttonText}</p>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
