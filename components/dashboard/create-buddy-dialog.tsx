"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/store/app-store";
import { useBuddies } from "@/hooks/use-buddies";
import { BrainCircuit, Loader2 } from "lucide-react";

const createBuddySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  description: z.string().optional(),
});

type CreateBuddyFormValues = z.infer<typeof createBuddySchema>;

export function CreateBuddyDialog() {
  const { createModalOpen, setCreateModalOpen } = useAppStore();
  const { createBuddy } = useBuddies();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBuddyFormValues>({
    resolver: zodResolver(createBuddySchema),
    defaultValues: {
      name: "",
      subject: "",
      description: "",
    },
  });

  const onSubmit = async (data: CreateBuddyFormValues) => {
    try {
      await createBuddy.mutateAsync(data);
      setCreateModalOpen(false);
      reset();
    } catch (error) {
      console.error("Failed to create buddy:", error);
    }
  };

  return (
    <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
             <BrainCircuit className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center">Create StudyBuddy</DialogTitle>
          <DialogDescription className="text-center">
            Give your AI study companion a name and subject to get started.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-bold text-slate-700">Buddy Name</Label>
            <Input
              id="name"
              placeholder="e.g. Physics Pro, History Helper"
              className="rounded-xl border-slate-200 focus:ring-primary h-11"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-bold text-slate-700">Subject</Label>
            <Input
              id="subject"
              placeholder="e.g. Quantum Physics, Modern History"
              className="rounded-xl border-slate-200 focus:ring-primary h-11"
              {...register("subject")}
            />
            {errors.subject && (
              <p className="text-xs text-red-500 font-medium">{errors.subject.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-bold text-slate-700">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="What will this buddy help you with?"
              className="rounded-xl border-slate-200 focus:ring-primary resize-none h-24"
              {...register("description")}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-primary/20"
              disabled={createBuddy.isPending}
            >
              {createBuddy.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Buddy"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
