import { GeneratePodcastProps } from "@/types";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { set } from "react-hook-form";

const useGeneratePodcast = ({
  voicePrompt,
  setVoicePrompt,
  setAudioStorageId,
  setAudio,
}: GeneratePodcastProps) => {

  const [isGenerating, setIsGenerating] = useState(false);
  const generatePodcast = async () => {
    setIsGenerating(true);
    setAudio('');

    if(!voicePrompt){
      // todo: show error message
      return setIsGenerating(false);
    }
    try{
      // const response = await getPodcastAudio({
      //   voice: voiceType,
      //   input: voicePrompt
      // });
    }
    catch (error) {
      console.error("Error generating podcast:", error);
    }
  }

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
