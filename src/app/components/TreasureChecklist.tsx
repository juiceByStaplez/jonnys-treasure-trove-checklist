"use client";

import { useState, useEffect, Fragment } from "react";

import { Treasure } from "@/app/types";
import { getData } from "@/app/actions";

let alreadyCollectedTreasureNumbers: number[] = [];

export default function TreasureChecklist() {
  const [treasures, setTreasures] = useState<Treasure[]>([]);
  const [visibleTreasures, setVisibleTreasures] = useState<Treasure[]>([]);

  useEffect(() => {
    const localAlreadyStoredTreasures = localStorage.getItem(
      "alreadyCollectedTreasures"
    );
    if (localAlreadyStoredTreasures) {
      alreadyCollectedTreasureNumbers = JSON.parse(localAlreadyStoredTreasures);
    }
    async function fetchData() {
      try {
        const fetchedTreasures = await getData();
        setTreasures(fetchedTreasures);
        setVisibleTreasures(
          fetchedTreasures.filter(
            (t) => !alreadyCollectedTreasureNumbers.includes(t.number)
          )
        );
      } catch (err) {
        console.log("Error is ", err);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-col w-50vw">
      <div className="flex flex-col justify-end">
        <div className="flex">
          <input
            id="treasureSearch"
            name="treasure-search"
            type="text"
            placeholder="Enter the number of the treasure you want to find"
            className="block h-16 w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            onChange={(e) => {
              const value = e.target.value;
              const isANumber = !Number.isNaN(Number(e.target.value));
              if (isANumber && value !== "") {
                const updatedList = treasures.filter((t) => {
                  return t.number === Number(value);
                });

                setVisibleTreasures(updatedList);
              } else if (value === "") {
                setVisibleTreasures(treasures);
              }
            }}
          />
        </div>
        <button
          className="bg-red-500 rounded p-4 my-2"
          onClick={(e) => {
            alreadyCollectedTreasureNumbers = [];
            setVisibleTreasures(treasures);
            localStorage.setItem(
              "alreadyCollectedTreasures",
              JSON.stringify(alreadyCollectedTreasureNumbers)
            );
          }}
        >
          Reset List
        </button>
      </div>
      {visibleTreasures.map((t, i) => {
        const bgClass = t.isSearchedFor ? "bg-orange-800" : "bg-slate-800";
        return (
          <Fragment key={i}>
            {!t.isCollected && (
              <div
                className={`treasure-list-grid grid ${bgClass} rounded justify-between p-4 mt-1 w-full`}
              >
                <div className="flex">
                  <input
                    type="checkbox"
                    checked={t.isCollected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        const updatedTreasures = visibleTreasures.map(
                          (treasure, index) => {
                            if (i === index) {
                              treasure.isCollected = true;
                            }
                            return treasure;
                          }
                        );
                        setVisibleTreasures(updatedTreasures);

                        alreadyCollectedTreasureNumbers.push(t.number);
                        localStorage.setItem(
                          "alreadyCollectedTreasures",
                          JSON.stringify(alreadyCollectedTreasureNumbers)
                        );
                      }
                    }}
                  />
                </div>
                <div className="flex">{t.number}</div>
                <div className="flex flex-col">
                  <div className="flex">
                    <span>{t.title}</span>
                  </div>
                  <div className="flex mt">
                    <span>{t.description}</span>
                  </div>
                </div>
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
