import { AuthErrorCode } from "@/static/auth";
import {
  useRouter,
  useSearchParams as useNextSearchParams,
  usePathname,
} from "next/navigation";

type TSearchParamsDefaultValues<K extends string> = Record<K, string | number>;

export const useSearchParams = <K extends string>(
  defaultValues: TSearchParamsDefaultValues<K>
) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useNextSearchParams();

  function get<V>(key: K): V {
    const raw = searchParams.get(key);
    if (typeof defaultValues[key] === "number")
      return (Number(raw) || defaultValues[key]) as V;
    else return (raw || "") as V;
  }

  const set = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.replace(
      `${pathName}${params.size > 0 ? "?" + params.toString() : ""}`
    );
  };

  const remove = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.replace(
      `${pathName}${params.size > 0 ? "?" + params.toString() : ""}`
    );
  };

  return { get, set, remove };
};

export const getAuthErrorUrl = (code: AuthErrorCode, callbackUrl?: string) =>
  `/auth/error?code=${code}${callbackUrl ? `&callbackUrl=${callbackUrl}` : ""}`;
