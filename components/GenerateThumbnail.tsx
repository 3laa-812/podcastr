import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "./ui/textarea";
import { GenerateThumbnailProps } from "@/types";
import { Loader } from "lucide-react";
import { Input } from "./ui/input";
import Image from "next/image";
import { set } from "react-hook-form";
import { toast } from "sonner";
import { useAction, useMutation } from "convex/react";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";

const GenerateThumbnail = ({
  setImage,
  setImageStorageId,
  image,
  imagePrompt,
  setImagePrompt,
}: GenerateThumbnailProps) => {
  const [isAiThumbnail, setIsAiThumbnail] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);
  const getImageUrl = useMutation(api.podcasts.getUrl);
  const generateThumbnail = useAction(api.openai.generateThumbnailAction);

  const handleImage = async (blob: Blob, fileName: string) => {
    setIsImageLoaded(true);
    setImage("");
    try {
      const file = new File([blob], fileName, { type: "image/png" });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;
      setImageStorageId(storageId);

      const imageUrl = await getImageUrl({ storageId });
      setImage(imageUrl!);
      setIsImageLoaded(false);
      toast("Podcast generated successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Error generating thumbnail");
    }
  };

  const base64ToBlob = (base64DataUrl: string) => {
    const parts = base64DataUrl.split(",");
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/png";
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const generateImage = async () => {
    try {
      const { thumbnailBase64 } = await generateThumbnail({
        prompt: imagePrompt,
      });
      const blob = base64ToBlob(thumbnailBase64);
      await handleImage(blob, `thumbnail-${uuidv4()}.png`);
      setIsImageLoaded(false);
      toast("Podcast generated successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Error generating thumbnail");
    }
  };

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      const files = e.target.files;
      if (!files) return;
      const file = files[0];
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));

      handleImage(blob, file.name);
    } catch (error) {
      console.log(error);
      toast.error("Error generating thumbnail");
    }
  };

  return (
    <>
      <div className="mt-[30px] flex w-full max-w-[520px] flex-col justify-between gap-2 rounded-lg border border-[#24272C] bg-[#15171C] px-2.5 py-2 md:flex-row md:gap-0">
        <Button
          type="button"
          variant="plain"
          className={cn("", {
            "bg-[#24272C]": isAiThumbnail,
          })}
          onClick={() => setIsAiThumbnail(true)}
        >
          Use Ai to generate thumbnail
        </Button>
        <Button
          type="button"
          variant="plain"
          className={cn("", {
            "bg-[#24272C]": !isAiThumbnail,
          })}
          onClick={() => setIsAiThumbnail(false)}
        >
          Upload custom image
        </Button>
      </div>
      {isAiThumbnail ? (
        <div className="flex flex-col gap-5">
          <div className="mt-5 flex flex-col gap-2.5">
            <Label className="text-[16px] font-bold text-white">
              Ai Prompt to generate Thumbnail
            </Label>
            <Textarea
              className="font-light focus-visible:ring-offset-[#F97535]"
              placeholder="Provide text to generate thumbnail"
              rows={5}
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
            />
          </div>
          <div className="w-full max-w-[150px]">
            <Button
              className="text-[16px] w-full bg-[#F97535] py-4 font-bold text-white hover:bg-[#F97535] cursor-pointer"
              type="submit"
              onClick={generateImage}
            >
              {isImageLoaded ? (
                <>
                  Generating
                  <Loader size={20} className="animate-spin ml-1" />{" "}
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => {
            if (imgRef.current) {
              (imgRef.current as HTMLInputElement).click();
            }
          }}
          className="flex items-center justify-center mt-5 h-[142px] w-full cursor-pointer flex-col gap-3 rounded-xl border-[3.2px] border-dashed border-[#24272C] bg-[#15171C]"
        >
          <Input
            type="file"
            className="hidden"
            ref={imgRef}
            onChange={(e) => uploadImage(e)}
          />
          {!isImageLoaded ? (
            <Image
              src={"/icons/upload-image.svg"}
              alt="upload image"
              width={40}
              height={40}
            />
          ) : (
            <div className="text-[16px] flex items-center font-medium">
              Uploading
              <Loader size={20} className="animate-spin ml-2" />
            </div>
          )}
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-[14px] font-bold text-[#F97535]">
              Click to upload
            </h2>
            <p className="text-[12px] text-[#FFFFFFA3]">
              PNG, JPEG, WEBP or GIF (max. 4MB)
            </p>
          </div>
        </div>
      )}

      {image && (
        <div className="flex items-center justify-center w-full">
          <Image
            src={image}
            alt="thumbnail"
            width={200}
            height={200}
            className="mt-5"
          />
        </div>
      )}
    </>
  );
};

export default GenerateThumbnail;
