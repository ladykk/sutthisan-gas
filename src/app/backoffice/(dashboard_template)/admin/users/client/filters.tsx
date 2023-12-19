import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/hooks";
import { useSearchParams } from "@/lib/url";

export const SearchSection = () => {
  const searchParams = useSearchParams({
    search: "",
  });
  const [currentSearch, setCurrentSearch] = useDebounce(
    searchParams.get("search"),
    (value) =>
      value.length > 0
        ? searchParams.set("search", value)
        : searchParams.remove("search")
  );

  return (
    <Input
      value={currentSearch}
      onChange={(e) => setCurrentSearch(e.target.value)}
      placeholder="Search by email, full name, phone number"
      className="w-[400px]"
    />
  );
};
