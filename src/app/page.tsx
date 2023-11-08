"use client";

import { QueryKey, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type Pokemon = {
  name: string;
  url: string;
};

async function fetchPokemon({ queryKey }: { queryKey: QueryKey }) {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${queryKey[1]}&offset=0`
  ).then((res) => res.json());

  return res.results as Pokemon[];
}

function getImageURL(pokemonId: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png
`;
}

export default function Home() {
  const [limit, setLimit] = useState(20);
  const { data } = useQuery({
    queryKey: ["pokemon", limit],
    queryFn: fetchPokemon,
  });

  const bottomRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full max-w-md mx-auto">
      <header className="bg-red-600 p-8 pb-4 fixed inset-x-0 h-">
        <h1 className="text-lg font-semibold">Pokedex</h1>
      </header>
      <main className="p-8 pt-24">
        {!!data ? (
          <>
            <ul className="grid grid-cols-2 gap-6">
              {data.map((datum, datumIdx) => (
                <li
                  key={datumIdx}
                  className="bg-slate-300 text-black min-h-[170px] rounded-md p-4"
                >
                  <Image
                    src={getImageURL(datumIdx + 1)}
                    alt={datum.name}
                    width={500}
                    height={500}
                    priority
                  />
                  <p className="mt-4 text-sm font-semibold text-center text-white">
                    {datum.name}
                  </p>
                </li>
              ))}
            </ul>
            <div ref={bottomRef}></div>
            <div className="mt-4 flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  setLimit((prevState) => prevState + 10);
                }}
                className=""
              >
                Load more
              </button>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </main>
    </div>
  );
}
