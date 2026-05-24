"use client";

import { useParams } from "next/navigation";
import RecipeGrid from "@/components/RecipeGrid";
import { getMealsByCategory } from "@/actions/mealdb.actions";

export default function CuisineRecipesPage() {
  const params = useParams();
  const cuisine = params.cuisine;

  return (
    <RecipeGrid
      type="category"
      value={cuisine}
      fetchAction={getMealsByCategory}
      backLink="/dashboard"
    />
  );
}