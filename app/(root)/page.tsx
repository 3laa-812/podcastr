import PodcastCard from "@/components/PodcastCard";
import { podcastData } from "@/constants";
import React from "react";

const Home = () => {
  return (
    <div className="flex flex-col gap-2">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Trending podcasts</h1>
        <div className=" grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {podcastData.map(({ id, title, description, imgURL }) => (
            <PodcastCard
              key={id}
              title={title}
              description={description}
              imgURL={imgURL}
              podcastId={id}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
