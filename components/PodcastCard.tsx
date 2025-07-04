import Image from "next/image";

const PodcastCard = ({
  title,
  description,
  imgURL,
  podcastId,
}: {
  title: string;
  description: string;
  imgURL: string;
  podcastId: number;
}) => {
  return (
    <div className="cursor-pointer">
      <figure className="flex flex-col gap-2">
        <Image
          src={imgURL}
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
