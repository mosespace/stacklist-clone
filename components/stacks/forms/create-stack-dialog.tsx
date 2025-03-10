'use client';

import CustomTextArea from '@/components/back-end/re-usable-inputs/custom-text-area';
import CustomText from '@/components/back-end/re-usable-inputs/text-reusable';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@mosespace/toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Stack name must be at least 2 characters.',
  }),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

interface CreateStackDialogProps {
  open: boolean;
  user: any;
  onOpenChange: (open: boolean) => void;
}

export function CreateStackDialog({
  open,
  user,
  onOpenChange,
}: CreateStackDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      isPublic: false,
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    data.isPublic = isPublic;
    try {
      const userId = user?.id;
      // console.log('Data:', user);

      const response = await fetch('/api/stacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.status === 201) {
        toast.success('Stack created!', result.message);
        reset();

        onOpenChange(false);

        router.refresh();
      } else {
        toast.error('Stack creation failed!', `${result.message}`);
      }
    } catch (error) {
      toast.error('Error', 'Failed to create stack. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Stack</DialogTitle>
          <DialogDescription>
            Create a new stack to compare products across different e-commerce
            platforms.
          </DialogDescription>
        </DialogHeader>
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <CustomText
              label="Name"
              register={register}
              name="name"
              type="text"
              errors={errors}
              placeholder="Eg; Gaming Laptops"
              disabled={isLoading}
              className="w-full"
            />
            <CustomTextArea
              label="Description"
              register={register}
              name="description"
              errors={errors}
              placeholder="Comparing gaming laptops for my next purchase..."
              disabled={isLoading}
            />

            <div className="flex items-center space-x-2">
              <label
                htmlFor="isPublic"
                className="text-sm font-medium leading-none"
              >
                Make stack public
              </label>
              <div
                className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                  isPublic ? 'bg-green-600' : 'bg-gray-200'
                }`}
                onClick={() => setIsPublic(!isPublic)}
              >
                <div
                  className={`h-5 w-5 rounded-full bg-white transform transition-transform m-0.5 ${
                    isPublic ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
            <DialogFooter>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Stack
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
