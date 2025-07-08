import { PodcastCardProps } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { tr } from "zod/v4/locales";

const PodcastCard = ({
  title,
  description,
  imgUrl,
  podcastId,
}: PodcastCardProps) => {

  const router = useRouter();

  const handleViews = () => {
    router.push(`/podcasts/${podcastId}`,{
      scroll: true
      });
  }

  return (
    <div className="cursor-pointer" onClick={handleViews}>
      <figure className="flex flex-col gap-2">
        <Image
          src={imgUrl}
          alt={title}
          width={174}
          height={174}
          className="aspect-square h-fit w-full rounded-xl 2xl:size[200px]"
        />
        <div className="flex flex-col">
          <h1 className="text-lg font-bold truncate">{title}</h1>
          <h2 className="text-sm truncate font-normal capitalize text-[#FFFFFFA3]">
            {description}
          </h2>
        </div>
      </figure>
    </div>
  );
};

export default PodcastCard;
