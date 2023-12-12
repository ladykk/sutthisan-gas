"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  formDataToObject,
  handleActionError,
  objectToFormData,
} from "@/lib/actions";
import { getNamePrefix } from "@/lib/auth";
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
import { useAction } from "next-safe-action/hook";
import { useForm } from "react-hook-form";

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
  const action = useAction(updateProfile, {
    onSuccess: (_, input) => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated",
        variant: "success",
      });
      form.reset(formDataToObject(input));
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
        onSubmit={form.handleSubmit((data) =>
          action.execute(objectToFormData(data))
        )}
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
              loading={action.status === "executing"}
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
  const action = useAction(updatePassword, {
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
        onSubmit={form.handleSubmit((data) =>
          action.execute(objectToFormData(data))
        )}
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
              loading={action.status === "executing"}
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

  const { toast } = useToast();
  const action = useAction(updateAvatar, {
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

  const avatarUrl = useFileUploadUrl(avatar, props.user?.avatarUrl ?? "");
  return (
    <Form {...form}>
      <form
        className="w-full"
        onSubmit={form.handleSubmit((data) =>
          action.execute(objectToFormData(data))
        )}
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
                        {getNamePrefix(props.user?.fullName ?? "")}
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
              loading={action.status === "executing" && form.formState.isDirty}
              disabled={!form.formState.isDirty}
            >
              Upload
            </Button>
            <Button
              variant="destructive"
              loading={action.status === "executing" && !form.formState.isDirty}
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
