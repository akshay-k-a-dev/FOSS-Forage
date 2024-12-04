"use client";

import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const roleDescriptions = {
  developer: "Join our development team and help build amazing features",
  writer: "Share your knowledge through engaging blog posts",
  mentor: "Create tutorials and mentor others in their learning journey",
  community: "Help manage and grow our community",
};

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  linkedin: z.string().url("Please enter a valid LinkedIn URL").optional().or(z.literal("")),
  github: z.string().url("Please enter a valid GitHub URL").optional().or(z.literal("")),
  motivation: z.string()
    .min(50, "Please write at least 50 characters")
    .max(1000, "Please keep your response under 1000 characters"),
});

export default function ApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const role = (params?.role as string || '') as keyof typeof roleDescriptions;

  // Redirect if invalid role
  if (!roleDescriptions[role]) {
    router.push("/contribute");
    return null;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      linkedin: "",
      github: "",
      motivation: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Here you would typically send the data to your backend
      console.log(values);
      
      toast.success("Application submitted successfully!");
      router.push("/contribute");
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Apply as {role.charAt(0).toUpperCase() + role.slice(1)}</h1>
        <p className="text-muted-foreground">{roleDescriptions[role]}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn Profile (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://linkedin.com/in/your-profile" {...field} />
                </FormControl>
                <FormDescription>
                  Share your professional experience
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub Profile (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/your-username" {...field} />
                </FormControl>
                <FormDescription>
                  Share your code contributions
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="motivation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Why do you want to volunteer for this role?</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell us about your motivation and what you hope to contribute..."
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Share your motivation, relevant experience, and what you hope to achieve
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button type="submit" className="w-full">Submit Application</Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={() => router.push("/contribute")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
