"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { voiceDetails } from "@/constants";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import GeneratePodcast from "@/components/GeneratePodcast";
import GenerateThumbnail from "@/components/GenerateThumbnail";
import { Loader } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

const formSchema = z.object({
  podcastTitle: z.string().min(6, {
    message: "Username must be at least 6 characters.",
  }),
  podcastDescription: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

const CreatePodcast = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [voicePrompt, setVoicePrompt] = useState("");
  const [voiceType, setVoiceType] = useState<string | null>(null);
  
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  
  const [audioUrl, setAudioUrl] = useState("");
  const [audioStorageId, setAudioStorageId] = useState<Id<"_storage"> | null>(null);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: "",
      podcastDescription: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <section className="mt-10 flex flex-col">
      <h1 className="text-20 font-bold text-white-1">Create Podcast</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-12 flex w-full flex-col"
        >
          <div className="flex flex-col gap-[30px] border-b border-[#2E3036] pb-10">
            <FormField
              control={form.control}
              name="podcastTitle"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-[16px] font-bold">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Our Pro Podcast"
                      {...field}
                      className="focus-visible:ring-[#F97535] text-[16px] placeholder:text-[16px] bg-[#15171C] rounded-[6px] placeholder:text-[#71788B] border-none text-[#71788B]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2.5">
              <Label className="text-[16px] font-bold">Select Ai Voice</Label>
              <Select onValueChange={(value) => setVoiceType(value)}>
                <SelectTrigger
                  className={cn(
                    "text-[16px] bg-[#15171C] border-none text-[#71788B] placeholder:text-[#71788B] rounded-[6px]"
                  )}
                >
                  <SelectValue
                    placeholder="Select Ai Voice"
                    className="placeholder:text-[#71788B]"
                  />
                </SelectTrigger>
                <SelectContent className="text-[16px] bg-[#15171C] border-none font-bold focus:ring-[#F97535]">
                  {voiceDetails.map(({ name, id }) => (
                    <SelectItem
                      key={id}
                      value={name}
                      className="capitalize focus:bg-[#F97535] transition-colors duration-150"
                    >
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
                {voiceDetails && (
                  <audio
                    src={`/${voiceDetails}.mp3`}
                    autoPlay
                    className="hidden"
                  />
                )}
              </Select>
            </div>
            <FormField
              control={form.control}
              name="podcastDescription"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-[16px] font-bold">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write a short podcast description"
                      {...field}
                      className="focus-visible:ring-[#F97535] text-[16px] placeholder:text-[16px] bg-[#15171C] rounded-[6px] placeholder:text-[#71788B] border-none text-[#71788B]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col pt-10">
            <GeneratePodcast 
            setAudioStorageId={setAudioStorageId}
            setAudio={setAudioUrl}
            voiceType={voiceType}
            audio={audioUrl}
            setVoicePrompt={setVoicePrompt}
            voicePrompt={voicePrompt}
            setAudioDuration={setAudioDuration}
            />
            <GenerateThumbnail />
            <div className="mt-10 w-full">
              <Button
                className="text-[16px] w-full bg-[#F97535] py-4 font-extrabold transition-all duration-500 hover:bg-[#15171C] text-white"
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    Submitting
                    <Loader size={20} className="animate-spin ml-1" />{" "}
                  </>
                ) : (
                  "Submit & Publish Podcast"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
};
export default CreatePodcast;
