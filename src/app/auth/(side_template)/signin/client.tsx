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
import { handleActionError } from "@/lib/actions";
import { TSignInFn, TSignInSchema } from "@/server/actions/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

type TSignInClientProps = {
  mutationFn: TSignInFn;
  allowSignup: boolean;
};

export default function SignInClient(props: TSignInClientProps) {
  const form = useForm<TSignInSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: props.mutationFn,
    onSuccess: (data) => {
      if (data.status === "success") {
        router.push("/");
      } else {
        handleActionError(data, {
          setFormError: form.setError,
          message: {
            unauthorized: (message) => {
              form.setError("email", {
                message: " ",
              });
              form.setError("password", {
                message: message,
              });
            },
          },
        });
      }
    },
  });
  return (
    <Form {...form}>
      <form
        className="max-w-lg w-full"
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
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
            <Button type="submit" loading={mutation.isLoading}>
              Sign In
            </Button>
            {props.allowSignup && (
              <Link
                href="/auth/signup"
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
