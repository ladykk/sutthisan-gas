import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export interface FileUploadProps {
  className?: string;
  value: File | null;
  onChange: (file: File | null) => void;
  readOnly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  clearable?: boolean;
  accept?: Array<string>;
}

const FileUpload = (props: FileUploadProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex w-full">
      <input
        type="file"
        className="hidden"
        value={""}
        ref={inputRef}
        onChange={async (e) => {
          if (e.target.files?.length) {
            props.onChange(e.target.files[0]);
          }
        }}
        accept={props.accept?.join(",")}
        readOnly={props.readOnly}
        disabled={props.disabled}
      />
      <div
        className={cn(
          "relative flex h-10 w-full rounded-md border border-input bg-background items-center justify-between px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:cursor-pointer",
          props.disabled && "cursor-not-allowed opacity-50",
          !props.value && "text-muted-foreground",
          props.className
        )}
      >
        <p
          className={cn(
            "absolute left-3 top-0 translate-y-1/2 truncate right-3 overflow-hidden",
            props.clearable && props.value && "right-8"
          )}
        >
          {props.value?.name || props.placeholder || "No file selected"}
        </p>
        {!props.readOnly &&
          props.clearable &&
          !props.disabled &&
          props.value && (
            <X
              className=" text-muted-foreground w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => props.onChange(null)}
            />
          )}
      </div>
      {!props.readOnly && (
        <Button
          className="ml-2"
          onClick={() => inputRef.current?.click()}
          disabled={props.disabled}
          type="button"
        >
          Select
        </Button>
      )}
    </div>
  );
};

export const useFileUploadUrl = (file: File | null, defaultUrl: string) => {
  const [url, setUrl] = useState<string>(defaultUrl);
  useEffect(() => {
    if (file) {
      setUrl(URL.createObjectURL(file));
    } else {
      setUrl(defaultUrl);
    }
  }, [file, defaultUrl]);

  return url;
};

export { Input, FileUpload };
