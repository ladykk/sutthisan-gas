export const ApplicationsId = ["Backoffice"] as const;

export type TApplicationId = (typeof ApplicationsId)[number];

export const Applications = ApplicationsId.reduce((acc, id) => {
  acc[id] = id;
  return acc;
}, {} as Record<TApplicationId, TApplicationId>);

export const ApplicationsList: Record<
  TApplicationId,
  {
    id: TApplicationId;
    label: string;
    description: string;
    colorCode: string;
  }
> = {
  Backoffice: {
    id: "Backoffice",
    label: "Backoffice",
    description: "Backoffice",
    colorCode: "#000000",
  },
};
