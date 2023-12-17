import { AuthErrorCode } from "@/static/auth";
import {
  useRouter,
  useSearchParams as useNextSearchParams,
  usePathname,
} from "next/navigation";

type TSearchParamsAcceptableValues = string | number | boolean;
type TSearchParamsDefaultValues<Key extends string> = {
  [key in Key]: TSearchParamsAcceptableValues;
};

export function useSearchParams<
  Key extends string,
  Schema extends TSearchParamsDefaultValues<Key>
>(defaultValues: Schema) {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useNextSearchParams();

  type Value<K extends Key> = Schema[K];

  function get<K extends Key>(key: K): Value<K> {
    const raw = searchParams.get(key);
    if (typeof defaultValues[key] === "number")
      // @ts-expect-error
      return Number(raw) || (defaultValues[key] as Value<K>);
    else if (typeof defaultValues[key] === "boolean")
      // @ts-expect-error
      return raw === "1" || (defaultValues[key] as Value<K>);
    // @ts-expect-error
    else return raw || (defaultValues[key] as Value<K>);
  }

  function set<K extends Key>(key: K, value: Value<K>) {
    const params = new URLSearchParams(searchParams.toString());
    if (typeof value === "boolean") params.set(key, value ? "1" : "0");
    else if (typeof value === "number") params.set(key, `${value}`);
    else params.set(key, value);
    router.replace(
      `${pathName}${params.size > 0 ? "?" + params.toString() : ""}`
    );
  }

  const remove = (key: Key) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.replace(
      `${pathName}${params.size > 0 ? "?" + params.toString() : ""}`
    );
  };

  return { get, set, remove };
}

export const getAuthErrorUrl = (code: AuthErrorCode, callbackUrl?: string) =>
  `/auth/error?code=${code}${callbackUrl ? `&callbackUrl=${callbackUrl}` : ""}`;
