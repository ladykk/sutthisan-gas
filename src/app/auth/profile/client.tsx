"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { FileUpload, Input, useFileUploadUrl } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { handleActionError } from "@/lib/actions";
import { getNamePrefix } from "@/lib/auth";
import {
  TGetSession,
  TUpdateAvatarFn,
  TUpdateAvatarSchema,
  TUpdatePasswordFn,
  TUpdatePasswordSchema,
  TUpdateProfileFn,
  TUpdateProfileSchema,
} from "@/server/actions/auth";
import { IMAGE_MIME_TYPES } from "@/server/form";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

interface TProfilePageProps<T> {
  session: TGetSession;
  mutationFn: T;
}

export function ProfileInfoForm(props: TProfilePageProps<TUpdateProfileFn>) {
  const form = useForm<TUpdateProfileSchema>({
    defaultValues: {
      fullName: props.session?.user?.fullName ?? "",
      phoneNumber: props.session?.user?.phoneNumber ?? "",
    },
  });

  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: props.mutationFn,
    onSuccess: (data, variables) => {
      if (data.status === "success") {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated",
          variant: "success",
        });
        form.reset(variables);
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
        className=" w-full"
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
      >
        <Card>
          <CardHeader>
            <CardTitle>Profile Infomation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <FormItem>
              <Label required>Email</Label>

              <Input
                value={props.session?.user?.email ?? ""}
                placeholder="yourname@example.com"
                type="email"
                inputMode="email"
                readOnly
                disabled
              />
            </FormItem>
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
          </CardContent>
          <CardFooter>
            <Button
              loading={mutation.isLoading}
              type="submit"
              disabled={!form.formState.isDirty}
            >
              Update
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

export function ProfileChangePasswordForm(
  props: TProfilePageProps<TUpdatePasswordFn>
) {
  const form = useForm<TUpdatePasswordSchema>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: props.mutationFn,
    onSuccess: (data) => {
      if (data.status === "success") {
        toast({
          title: "Password Updated",
          description: "Your password has been updated",
          variant: "success",
        });
        form.reset({
          password: "",
          confirmPassword: "",
        });
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
        className=" w-full"
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
      >
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
            <Button
              loading={mutation.isLoading}
              type="submit"
              disabled={!form.formState.isDirty}
            >
              Change
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

export function ProfileAvatarForm(props: TProfilePageProps<TUpdateAvatarFn>) {
  const form = useForm<TUpdateAvatarSchema>({
    defaultValues: {
      avatar: null,
    },
  });
  const avatar = form.watch("avatar");

  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: props.mutationFn,
    onSuccess: (data) => {
      if (data.status === "success") {
        toast({
          title: "Avatar Updated",
          description: "Your avatar has been updated",
          variant: "success",
        });
        form.reset({
          avatar: null,
        });
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

  const avatarUrl = useFileUploadUrl(
    avatar,
    props.session?.user?.avatarUrl ?? ""
  );
  return (
    <Form {...form}>
      <form
        className="w-full"
        onSubmit={form.handleSubmit((data) => {
          const formData = new FormData();
          if (data.avatar) formData.append("avatar", data.avatar as File);
          mutation.mutate(formData);
        })}
      >
        <Card>
          <CardHeader>
            <CardTitle>Avatar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Avatar</FormLabel>
                  <div className="flex gap-3 items-center justify-center">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback className="text-xl">
                        {getNamePrefix(props.session?.user?.fullName ?? "")}
                      </AvatarFallback>
                    </Avatar>
                    <FormControl>
                      <FileUpload
                        {...field}
                        accept={IMAGE_MIME_TYPES}
                        clearable
                      />
                    </FormControl>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="space-x-3">
            <Button
              loading={mutation.isLoading && form.formState.isDirty}
              disabled={!form.formState.isDirty}
            >
              Upload
            </Button>
            <Button
              variant="destructive"
              loading={mutation.isLoading && !form.formState.isDirty}
              disabled={
                !props.session.user?.avatarUrl || form.formState.isDirty
              }
            >
              Remove
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
