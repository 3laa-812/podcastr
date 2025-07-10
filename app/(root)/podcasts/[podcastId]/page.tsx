"use client";

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import PodcastDetailPlayer from "@/components/PodcastDetailPlayer";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Image from "next/image";
import React from "react";

const PodcastDetails = ({
  params,
}: {
  params: Promise<{ podcastId: Id<"podcasts"> }>;
}) => {
  const { user } = useUser();
  const { podcastId } = React.use(params);
  const podcast = useQuery(api.podcasts.getPodcastById, {
    podcastId,
  });

  const similarPodcasts = useQuery(api.podcasts.getPodcastByVoiceType, {
    podcastId,
  });

  if (!similarPodcasts || !podcast) {
    return <LoaderSpinner />;
  }

  const isOwner = user?.id === podcast?.authorId;

  return (
    <section className="flex flex-col w-full">
      <header className="mt-9 flex items-center justify-between">
        <h1 className="text-[20px] font-bold">Currently Playing</h1>
        <figure className="flex gap-3">
          <Image
            src="/icons/headphone.svg"
            width={24}
            height={24}
            alt="headphone"
          />
          <h2 className="text-[16px] font-bold">{podcast?.views}</h2>
        </figure>
      </header>
      <PodcastDetailPlayer
        isOwner={isOwner}
        {...podcast}
        podcastId={podcast._id}
      />
      <p className="text-[16px] pb-8 pt-[45px] font-medium max-md:text-center text-[#FFFFFFB8]">
        {podcast?.podcastDescription}
      </p>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-[18px] font-bold">Transcription</h1>
          <p className="text-[16px] font-medium text-[#FFFFFFB8]">
            {podcast?.voicePrompt}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-[18px] font-bold">Thumbnail Prompt</h1>
          <p className="text-[16px] font-medium text-[#FFFFFFB8]">
            {podcast?.imagePrompt}
          </p>
        </div>
      </div>
      <section className="mt-8 flex flex-col gap-5">
        <h1 className="text-[20px] font-bold">Similar Podcasts</h1>
        {similarPodcasts && similarPodcasts.length > 0 ? (
          <div className=" grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {similarPodcasts?.map(
              ({ _id, podcastTitle, podcastDescription, imageUrl }) => (
                <PodcastCard
                  key={_id}
                  title={podcastTitle}
                  description={podcastDescription}
                  imgUrl={imageUrl || "/images/p-6.png"}
                  podcastId={_id}
                />
              )
            )}
          </div>
        ) : (
          <>
            <EmptyState
              title="No similar podcasts found"
              buttonLink="/discover"
              buttonText="Discover more podcasts"
            />
          </>
        )}
      </section>
    </section>
  );
};

export default PodcastDetails;
