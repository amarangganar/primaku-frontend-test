"use client";

import {
  QueryKey,
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

type Pokemon = {
  name: string;
  url: string;
};

async function fetchPokemon({ pageParam }: { pageParam: number }) {
  console.log(pageParam);
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${pageParam}`
  ).then((res) => res.json());

  return res.results as Pokemon[];
}


function getImageURL(pokemonId: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png
`;
}

export default function Home() {
  const { ref, inView } = useInView();

  const { data: pokemons, fetchNextPage } = useInfiniteQuery({
    queryKey: ["pokemon"],
    queryFn: fetchPokemon,
    initialPageParam: 0,
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) =>
      firstPageParam - 1 || undefined,
    getNextPageParam: (_lastPage, _allPages, lastPageParam) =>
      lastPageParam + 1 || undefined,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return (
    <div className="relative w-full max-w-md mx-auto h-screen overflow-hidden">
      <header className="bg-red-600 p-8 pb-4 absolute inset-x-0">
        <h1 className="text-lg font-semibold">Pokedex</h1>
      </header>
      <main className="p-8 pt-24 overflow-y-auto h-full">
        {!!pokemons ? (
          <>
            <ul className="grid grid-cols-2 gap-6">
              {pokemons.pages.flat().map((pokemon, pokemonIdx) => (
                <li
                  key={pokemonIdx}
                  className="text-black min-h-[170px] rounded-md p-4 bg-slate-500"
                >
                  <Image
                    src={getImageURL(pokemonIdx + 1)}
                    alt={pokemon.name}
                    width={500}
                    height={500}
                    priority
                  />
                  <p className="mt-4 text-sm font-semibold text-center text-white">
                    {pokemon.name}
                  </p>
                </li>
              ))}
            </ul>
            <div ref={ref}></div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </main>
    </div>
  );
}
