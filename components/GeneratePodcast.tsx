import { GeneratePodcastProps } from "@/types";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { generateUploadUrl } from "@/convex/files";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { toast } from "sonner";

// Helper to convert dataURL to Blob
function dataURLtoBlob(dataurl: string) {
  const arr = dataurl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) throw new Error("Invalid data URL: cannot extract mime type");
  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

const useGeneratePodcast = ({
  voicePrompt,
  setVoicePrompt,
  setAudioStorageId,
  setAudio,
  voiceType,
}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);

  const getPodcastAudio = useAction(api.openai.generateAudioAction);
  const getAudioUrl = useMutation(api.podcasts.getUrl);

  const generatePodcast = async () => {
    setIsGenerating(true);
    setAudio("");

    if (!voicePrompt) {
      toast("Please provide a voiceType to generate a Podcast");
      return setIsGenerating(false);
    }
    try {
      const response = await getPodcastAudio({ input: voicePrompt });
      setAudio(response);

      const blob = dataURLtoBlob(response);
      const fileName = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, { type: "audio/mpeg" });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;
      setAudioStorageId(storageId);

      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl!);
      setIsGenerating(false);
      toast("Podcast generated successfully!");
    } catch (error) {
      console.error("Error generating podcast:", error);
      toast("Failed to generate podcast. Please try again.");
    }
  };

  return { isGenerating, generatePodcast };
};

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast } = useGeneratePodcast(props);

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-[16px] font-bold text-white">
          Ai Prompt to generate Podcast
        </Label>
        <Textarea
          className="font-light focus-visible:ring-offset-[#F97535]"
          placeholder="Provide text to generate audio"
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
      </div>
      <div className="mt-5 w-full max-w-[150px]">
        <Button
          className="text-[16px] w-full bg-[#F97535] py-4 font-bold text-white hover:bg-[#F97535] cursor-pointer"
          type="submit"
          onClick={generatePodcast}
        >
          {isGenerating ? (
            <>
              Generating
              <Loader size={20} className="animate-spin ml-1" />{" "}
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>
      <div className="mt-5 w-full">
        {props.audio && (
          <audio
            src={props.audio}
            controls
            autoPlay
            onLoadedMetadata={(e) =>
              props.setAudioDuration(e.currentTarget.duration)
            }
          />
        )}
      </div>
    </div>
  );
};

export default GeneratePodcast;
