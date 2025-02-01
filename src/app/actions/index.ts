"use server";

import data from "@/data/treasures.json";

import { Treasure } from "@/app/types";

export async function getData(): Promise<Treasure[]> {
  const treasures = data;

  return treasures;
}
