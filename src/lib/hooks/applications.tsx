import { APPLICATION_ARRAY } from "@/static/application";
import { usePathname } from "next/navigation";

export const useApplicationId = () => {
  const pathName = usePathname();
  const applicationId =
    APPLICATION_ARRAY.find((application) =>
      pathName.startsWith(application.path)
    )?.id ?? "BackOffice";
  return applicationId;
};
