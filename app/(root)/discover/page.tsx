"use client";

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import SearchBar from "@/components/SearchBar";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import { useSearchParams } from "next/navigation";

function DiscoverContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const podcastsData = useQuery(api.podcasts.getPodcastBySearch, {
    search,
  });

  return (
    <div className="flex flex-col gap-9">
      <SearchBar />
      <div className="flex flex-col gap-9">
        <h1 className="text-[20px] font-bold">
          {!search ? "Discover Trending Podcasts" : "Search results for "}
          {search && <span className="text-[#71788B]">{search}</span>}
        </h1>
        {podcastsData ? (
          <>
            {podcastsData.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {podcastsData?.map(
                  ({ _id, podcastTitle, podcastDescription, imageUrl }) => (
                    <PodcastCard
                      key={_id}
                      title={podcastTitle}
                      description={podcastDescription}
                      imgUrl={imageUrl!}
                      podcastId={_id}
                    />
                  )
                )}
              </div>
            ) : (
              <EmptyState title="No results found" />
            )}
          </>
        ) : (
          <LoaderSpinner />
        )}
      </div>
    </div>
  );
}

export default function Discover() {
  return (
    <React.Suspense fallback={<LoaderSpinner />}>
      <DiscoverContent />
    </React.Suspense>
  );
}
