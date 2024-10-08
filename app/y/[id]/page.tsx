"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useSupabase } from "@/hooks/useSupabase";
import { useEffect, useState } from "react";
import { TYoutuber, IRestaurant } from "@/types";
import Container from "@/components/Container";
import Image from "next/image";
import Link from "next/link";
import RestaurantItem from "@/components/RestaurantItem";

/**
 * 유튜버별 추천한 식당 리스트를 보여줍니다
 */
export default function YoutuberPage() {
  const { id } = useParams();
  const { supabase } = useSupabase();
  const [youtuber, setYoutuber] = useState<TYoutuber | null>(null);
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      // Fetch youtuber data
      const { data: youtuberData } = await supabase
        .from("youtuber")
        .select(
          `
          *,
          restaurant(*, restaurant_menu(*))
          `
        )
        .eq("id", id)
        .single();

      if (youtuberData) {
        setYoutuber(youtuberData);
        setRestaurants(youtuberData.restaurant);
      }
    };

    fetchData();
  }, [id, supabase]);

  if (!youtuber) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Image
        src={youtuber.profileImage}
        width={100}
        height={100}
        className="rounded-full block"
        alt={youtuber.channelName}
      />
      <h1 className="font-bold text-2xl">{youtuber.channelName}</h1>
      <p className="text-sm text-gray-400">구독자: {youtuber.subscriber}명</p>
      <Link
        className="text-sm text-rose-500 hover:text-red-600 transition-colors duration-200"
        href={youtuber.channelUrl}
        target="_blank"
      >
        {youtuber.channelUrl}
      </Link>
      <hr className="my-5" />
      <h2 className="font-bold text-lg">최근 추천 식당</h2>
      <ul>
        {restaurants.map((restaurant) => (
          <RestaurantItem key={restaurant.id} restaurant={restaurant} />
        ))}
      </ul>
    </Container>
  );
}
