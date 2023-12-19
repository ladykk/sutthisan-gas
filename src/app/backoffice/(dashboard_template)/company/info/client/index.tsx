"use client";
import {
  LayoutHeadContainer,
  LayoutTitle,
} from "@/components/common/theme/dashboard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  actionMutation,
  actionQuery,
  formDataToObject,
  handleActionError,
  objectToFormData,
} from "@/lib/actions";
import {
  TSetCompanyInfoInput,
  getCompanyInfo,
  setCompanyInfo,
} from "@/server/actions/company";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useForm } from "react-hook-form";

export default function CompanyInfoClient() {
  const { toast } = useToast();
  const query = useQuery({
    queryKey: ["companyInfo"],
    queryFn: () => actionQuery(getCompanyInfo)(),
  });
  const form = useForm<TSetCompanyInfoInput>({
    defaultValues: query.data,
  });
  const mutation = useMutation({
    mutationFn: actionMutation(setCompanyInfo),
    onSuccess: () => {
      form.reset(form.getValues());
      toast({
        title: "Company information updated",
        description: "Company information updated successfully.",
        variant: "success",
      });
    },
    onError: handleActionError(
      toast,
      form.setError,
      "Could not update company information"
    ),
  });
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <>
      <LayoutHeadContainer
        left={<LayoutTitle>Company Infomation</LayoutTitle>}
        right={
          <Button
            loading={mutation.isPending}
            type="button"
            onClick={() => ref.current?.click()}
          >
            Update
          </Button>
        }
      />
      <Form {...form}>
        <form
          className="flex gap-5"
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
        >
          <div className="space-y-5 flex-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl ">Thai Information</CardTitle>
                <CardDescription>
                  These information will be used in Thai language.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <FormField
                  control={form.control}
                  name="companyNameLocal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ownerNameLocal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="locationNameLocal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="addressLocal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="resize-none" rows={5} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Contact Information</CardTitle>
                <CardDescription>
                  These information is use to display on an invoice.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <FormField
                  control={form.control}
                  name="taxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telephone Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          <Card className="flex-1 h-fit">
            <CardHeader>
              <CardTitle className="text-xl">English Information</CardTitle>
              <CardDescription>
                These information will be used in English language.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <FormField
                control={form.control}
                name="companyNameEng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ownerNameEng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="locationNameEng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="addressEng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="resize-none" rows={5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <button type="submit" hidden ref={ref} />
        </form>
      </Form>
    </>
  );
}
