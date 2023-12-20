import { AuthCard } from "@/components/common/auth";
import { RoleBadge } from "@/components/common/roles";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import {
  actionMutation,
  actionQuery,
  handleActionError,
  objectToFormData,
} from "@/lib/actions";
import {
  TGetUsers,
  TGrantRoleBackofficeSchema,
  getUserRoles,
  grantRoleBackoffice,
  revokeRoleBackoffice,
} from "@/server/actions/user";
import { ROLE_ID_ARRAY, ROLE_LIST } from "@/static/role";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Network } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

type UserRoleManagementProps = {
  user: TGetUsers["list"][0];
};

export function UserRoleManagement(props: UserRoleManagementProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const query = useQuery({
    queryKey: ["userRoles", `userId:${props.user.id}`],
    queryFn: () => actionQuery(getUserRoles)(props.user.id),
    enabled: open,
  });

  const form = useForm<TGrantRoleBackofficeSchema>({
    defaultValues: {
      userId: props.user.id,
      role: undefined,
    },
  });

  const grantMutation = useMutation({
    mutationFn: actionMutation(grantRoleBackoffice),
    onSuccess: () => {
      query.refetch();
      form.reset({
        userId: props.user.id,
        role: undefined,
      });
      toast({
        title: "Role granted",
        description: "Role granted successfully",
        variant: "success",
      });
    },
    onError: handleActionError(toast, form.setError, "Could not grant role"),
  });

  const revokeMutation = useMutation({
    mutationFn: actionMutation(revokeRoleBackoffice),
    onSuccess: () => {
      query.refetch();
      toast({
        title: "Role revoked",
        description: "Role revoked successfully",
        variant: "success",
      });
    },
    onError: handleActionError(toast, undefined, "Could not revoke role"),
  });

  const availableRoles = useMemo(
    () => ROLE_ID_ARRAY.filter((role) => !query.data?.includes(role)),
    [query.data]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Network />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Role Management</DialogTitle>
          <DialogDescription>Id: {props.user.id}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <AuthCard
            avatarUrl={props.user.avatarUrl}
            fullName={props.user.fullName}
            email={props.user.email}
          />
          <FormItem>
            <Label className="inline-flex">
              Current Roles{" "}
              {(query.isFetching || revokeMutation.isPending) && (
                <Spinner className="ml-2" />
              )}
            </Label>

            <div className="flex gap-3 flex-wrap">
              {query.data?.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No role assigned
                </p>
              ) : (
                query.data?.map((role) => (
                  <AlertDialog key={role}>
                    <AlertDialogTrigger>
                      <RoleBadge roleId={role} className="hover:line-through" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to revoke this role?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Role: {ROLE_LIST[role].label} (id: {role}) will be
                          revoked from {props.user.fullName} (id:{" "}
                          {props.user.id}) and cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className={buttonVariants({
                            variant: "destructive",
                          })}
                          onClick={() =>
                            revokeMutation.mutate({
                              userId: props.user.id,
                              role,
                            })
                          }
                        >
                          Revoke
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ))
              )}
            </div>
          </FormItem>
          {availableRoles.length > 0 && !query.isFetching && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => objectToFormData(data))}
                className="space-y-3"
              >
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Grant Role</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableRoles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {ROLE_LIST[role].label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button loading={grantMutation.isPending}>Grant</Button>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
