"use client";

import PodcastCard from "@/components/PodcastCard";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const Home = () => {
  const podcasts = useQuery(api.podcasts.getTrendingPodcasts);
  return (
    <div className="flex flex-col gap-2">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Trending podcasts</h1>
        <div className=" grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {podcasts?.map(
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
      </section>
    </div>
  );
};

export default Home;
