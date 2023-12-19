"use client";
import { Button } from "@/components/ui/button";
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
import {
  actionMutation,
  handleActionError,
  objectToFormData,
} from "@/lib/actions";
import {
  TGetUser,
  TUpdateAvatarSchema,
  TUpdatePasswordSchema,
  TUpdateProfileSchema,
  updateAvatar,
  updatePassword,
  updateProfile,
} from "@/server/actions/auth";
import { IMAGE_MIME_TYPES } from "@/server/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { AuthAvatar } from "@/components/common/auth";
import { useRouter } from "next/navigation";

type ProfilePageProps = {
  user: TGetUser;
};

export function ProfileInfoForm(props: ProfilePageProps) {
  const form = useForm<TUpdateProfileSchema>({
    defaultValues: {
      fullName: props.user?.fullName ?? "",
      phoneNumber: props.user?.phoneNumber ?? "",
    },
  });

  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: actionMutation(updateProfile),
    onSuccess: (_) => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated",
        variant: "success",
      });
      form.reset(form.getValues());
    },
    onError: handleActionError(
      toast,
      form.setError,
      "Could not update profile"
    ),
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
                value={props.user?.email ?? ""}
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
              loading={mutation.isPending}
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

export function ProfileChangePasswordForm(props: ProfilePageProps) {
  const form = useForm<TUpdatePasswordSchema>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: actionMutation(updatePassword),
    onSuccess: () => {
      toast({
        title: "Password Updated",
        description: "Your password has been updated",
        variant: "success",
      });
      form.reset({
        password: "",
        confirmPassword: "",
      });
    },
    onError: handleActionError(
      toast,
      form.setError,
      "Could not update password"
    ),
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
              loading={mutation.isPending}
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

export function ProfileAvatarForm(props: ProfilePageProps) {
  const form = useForm<TUpdateAvatarSchema>({
    defaultValues: {
      avatar: null,
    },
  });
  const avatar = form.watch("avatar");
  const router = useRouter();

  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: actionMutation(updateAvatar),
    onSuccess: () => {
      toast({
        title: "Avatar Updated",
        description: "Your avatar has been updated",
        variant: "success",
      });
      form.reset({
        avatar: null,
      });
    },
    onError: handleActionError(toast, form.setError, "Could not update avatar"),
  });

  console.log(avatar);

  const avatarUrl = useFileUploadUrl(avatar, props.user?.avatarUrl ?? "");
  console.log(avatarUrl);
  return (
    <Form {...form}>
      <form
        className="w-full"
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
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
                    <AuthAvatar
                      src={avatarUrl}
                      fullName={props.user?.fullName ?? ""}
                      className="w-20 h-20"
                    />
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
              loading={mutation.isPending && form.formState.isDirty}
              disabled={!form.formState.isDirty}
            >
              Upload
            </Button>
            <Button
              variant="destructive"
              loading={mutation.isPending && !form.formState.isDirty}
              disabled={!props.user?.avatarUrl || form.formState.isDirty}
            >
              Remove
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
