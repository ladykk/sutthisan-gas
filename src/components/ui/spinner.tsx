import { cn } from "@/lib/utils";
import { ReloadIcon } from "@radix-ui/react-icons";

export function Spinner(props: { className?: string }) {
  return <ReloadIcon className={cn("animate-spin", props.className)} />;
}

export function ScreenSpinner() {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/20 z-50 backdrop-blur-sm flex justify-center items-center">
      <Spinner className="w-10 h-10" />
    </div>
  );
}
