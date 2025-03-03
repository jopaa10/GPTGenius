"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import TourInfo from "./TourInfo";
import {
  createNewTour,
  fetchUserTokensById,
  generateTourResponse,
  getExistingTour,
  subtractTokens,
} from "../utils/action";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";

const NewTour = () => {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  const {
    mutate,
    isPending,
    data: tour,
  } = useMutation({
    mutationFn: async (destination) => {
      const existingTour = await getExistingTour(destination);

      if (existingTour) {
        return existingTour;
      }

      const currentTokens = await fetchUserTokensById(userId);
      if (currentTokens < 300) {
        toast.error("Token balance too low....");
        return;
      }

      const newTour = await generateTourResponse(destination);

      if (!newTour) {
        toast.error("No matching city found...");
        return null;
      }

      await createNewTour(newTour.tour);
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      const newTokens = await subtractTokens(userId, newTour.tokens);
      toast.success(`${newTokens} tokens remaining...`);
      return newTour.tour;
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const destinations = Object.fromEntries(formData.entries());

    mutate(destinations);
  };

  if (isPending) {
    return <span className="loading loading-lg"></span>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <h2 className="mb-4">select your dream destination</h2>
      <div className="join w-full">
        <input
          type="text"
          name="city"
          id="city"
          placeholder="city"
          className="input input-bordered join-item w-full"
          required
        />
        <input
          type="text"
          name="country"
          id="country"
          placeholder="country"
          className="input input-bordered join-item w-full"
          required
        />
        <button
          className="btn btn-primary join-item"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "please wait..." : "generate tour"}
        </button>
      </div>
      <div className="mt-16">{tour ? <TourInfo tour={tour} /> : null}</div>
    </form>
  );
};

export default NewTour;
