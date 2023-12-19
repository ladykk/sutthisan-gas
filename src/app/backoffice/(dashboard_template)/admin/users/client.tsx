"use client";

import {
  LayoutHeadContainer,
  LayoutTitle,
} from "@/components/common/theme/dashboard";
import { AuthAvatar, AuthCard } from "@/components/common/auth";
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
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DataTable,
  DataTableDate,
  DataTablePagination,
} from "@/components/ui/data-table";
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
import { Input } from "@/components/ui/input";
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
  actionQuery,
  handleActionError,
  objectToFormData,
} from "@/lib/actions";
import { useDebounce } from "@/lib/hooks";
import { useSearchParams } from "@/lib/url";
import { formatPhoneNumber } from "@/lib/utils";
import {
  TGetUsers,
  TGrantRoleBackofficeSchema,
  getUserRoles,
  getPaginateUsers,
  grantRoleBackoffice,
  revokeRoleBackoffice,
} from "@/server/actions/user";
import { ROLE_ID_ARRAY, ROLE_LIST } from "@/static/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Network } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

export default function BackofficeUserMgtUsersClient() {
  const searchParams = useSearchParams({
    page: 1,
    itemsPerPage: 10,
    search: "",
  });

  const query = useQuery({
    queryKey: [
      "users",
      `page:${searchParams.get("page")}`,
      `itemsPerPage:${searchParams.get("itemsPerPage")}`,
      `search:${searchParams.get("search")}`,
    ],
    queryFn: () =>
      actionQuery(getPaginateUsers)({
        search: searchParams.get("search"),
        page: searchParams.get("page"),
        itemsPerPage: searchParams.get("itemsPerPage"),
      }),
  });

  return (
    <>
      <LayoutHeadContainer
        left={
          <>
            <LayoutTitle>Users</LayoutTitle>
            {query.isFetching && <Spinner />}
          </>
        }
        right={
          <>
            <SearchSection />
          </>
        }
      />
      <DataTable
        data={query.data?.list}
        columns={[
          {
            accessorKey: "avatarUrl",
            header: "Avatar",
            cell: ({ row }) => (
              <AuthAvatar
                src={row.original.avatarUrl}
                fullName={row.original.fullName}
                className="h-14 w-14"
              />
            ),
          },
          {
            accessorKey: "email",
            header: "Email",
          },
          {
            accessorKey: "fullName",
            header: "Full Name",
          },
          {
            accessorKey: "phoneNumber",
            header: "Phone Number",
            cell: ({ row }) => formatPhoneNumber(row.original.phoneNumber),
          },
          {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ row }) => (
              <DataTableDate
                value={row.original.createdAt}
                display="datetime"
              />
            ),
          },
          {
            accessorKey: "updatedAt",
            header: "Updated At",
            cell: ({ row }) => (
              <DataTableDate
                value={row.original.updatedAt}
                display="datetime"
              />
            ),
          },
          {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
              <div className="space-x-3">
                <UserRoleManagement user={row.original} />
              </div>
            ),
          },
        ]}
      />
      <DataTablePagination
        className="mt-4"
        count={query.data?.count}
        currentPage={query.data?.currentPage}
        itemsPerPage={query.data?.itemsPerPage}
        totalPages={query.data?.totalPages}
        onPageChange={(page) => searchParams.set("page", page)}
        onItemsPerPageChange={(itemsPerPage) =>
          searchParams.set("itemsPerPage", itemsPerPage)
        }
      />
    </>
  );
}

const SearchSection = () => {
  const searchParams = useSearchParams({
    search: "",
  });
  const [currentSearch, setCurrentSearch] = useDebounce(
    searchParams.get("search"),
    (value) =>
      value.length > 0
        ? searchParams.set("search", value)
        : searchParams.remove("search")
  );

  return (
    <Input
      value={currentSearch}
      onChange={(e) => setCurrentSearch(e.target.value)}
      placeholder="Search by email, full name, phone number"
      className="w-[400px]"
    />
  );
};

type UserRoleManagementProps = {
  user: TGetUsers["list"][0];
};

function UserRoleManagement(props: UserRoleManagementProps) {
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
    },
  });

  const grantMutation = useMutation({
    mutationFn: grantRoleBackoffice,
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
    mutationFn: revokeRoleBackoffice,
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
        <Button size="icon">
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
                      <Badge
                        className="hover:cursor-pointer hover:line-through"
                        style={{ backgroundColor: ROLE_LIST[role].colorCode }}
                      >
                        {ROLE_LIST[role].label}
                      </Badge>
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
                            revokeMutation.mutate(
                              objectToFormData({ userId: props.user.id, role })
                            )
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
                onSubmit={form.handleSubmit((data) =>
                  grantMutation.mutate(objectToFormData(data))
                )}
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
