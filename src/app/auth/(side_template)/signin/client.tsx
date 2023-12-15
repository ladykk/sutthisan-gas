"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TSignInSchema, signIn } from "@/server/actions/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { handleActionError, objectToFormData } from "@/lib/actions";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "@/lib/url";

type TSignInClientProps = {
  allowSignup: boolean;
};

export default function SignInClient(props: TSignInClientProps) {
  const form = useForm<TSignInSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { toast } = useToast();
  const searchParams = useSearchParams({
    callbackUrl: "",
  });
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      router.push(searchParams.get("callbackUrl") || "/");
    },
    onError: handleActionError(toast, form.setError, "Could not sign in."),
  });

  return (
    <Form {...form}>
      <form
        className="max-w-lg w-full"
        onSubmit={form.handleSubmit((data) =>
          mutation.mutate(objectToFormData(data))
        )}
      >
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Please sign in to continue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="yourname@example.com"
                      type="email"
                      inputMode="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Password</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="******" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" loading={mutation.isPending}>
              Sign In
            </Button>
            {props.allowSignup && (
              <Link
                href={`/auth/signup${
                  searchParams.get("callbackUrl")
                    ? `?callbackUrl=${searchParams.get("callbackUrl")}`
                    : ""
                }`}
                className={buttonVariants({
                  variant: "link",
                })}
              >
                Create an account
              </Link>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
