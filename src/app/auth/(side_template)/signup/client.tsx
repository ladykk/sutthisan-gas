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
import { useToast } from "@/components/ui/use-toast";
import { handleActionError } from "@/lib/actions";
import { TSignUpFn, TSignUpSchema } from "@/server/actions/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

type TSignUpClientProps = {
  mutationFn: TSignUpFn;
};

export default function SignUpClient(props: TSignUpClientProps) {
  const form = useForm<TSignUpSchema>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phoneNumber: "",
    },
  });

  const { toast } = useToast();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: props.mutationFn,
    onSuccess: (data) => {
      console.log(data);
      if (data.status === "success") {
        toast({
          title: "Account created.",
          description: "Your account has been created.",
          variant: "success",
        });
        router.push("/auth/signin");
      } else {
        handleActionError(data, {
          setFormError: form.setError,
          message: {
            validation: (message) =>
              toast({
                title: "Validation Error",
                description: message,
                variant: "warning",
              }),
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
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Please sign up to continue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Firstname Lastname"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="0800000000" type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="******" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button loading={mutation.isLoading} type="submit">
              Sign Up
            </Button>
            <Link
              href="/auth/signin"
              className={buttonVariants({
                variant: "link",
              })}
            >
              Already have an account?
            </Link>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
