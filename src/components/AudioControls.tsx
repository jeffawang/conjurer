import { useEffect } from "react";
import { ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { observer } from "mobx-react-lite";
import { IconButton, Select, Tooltip } from "@chakra-ui/react";
import { BsSoundwave } from "react-icons/bs";
import { FaVolumeMute } from "react-icons/fa";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { ImLoop } from "react-icons/im";
import { useStore } from "@/src/types/StoreContext";
import { action, runInAction } from "mobx";
import {
  AUDIO_BUCKET_NAME,
  AUDIO_BUCKET_PREFIX,
  AUDIO_BUCKET_REGION,
} from "@/src/utils/audio";

export const AudioControls = observer(function AudioControls() {
  const store = useStore();
  const { uiStore, audioStore } = store;

  useEffect(() => {
    if (audioStore.audioInitialized) return;
    runInAction(() => {
      audioStore.audioInitialized = true;
    });

    // get list of objects from s3 bucket using aws sdk
    const s3 = new S3Client({
      credentials: fromCognitoIdentityPool({
        clientConfig: { region: "us-east-2" },
        identityPoolId: "us-east-2:343f9a70-6bf5-40f3-b21d-1376f65bb4be",
      }),
      region: AUDIO_BUCKET_REGION,
    });
    const listObjectsCommand = new ListObjectsCommand({
      Bucket: AUDIO_BUCKET_NAME,
      Prefix: AUDIO_BUCKET_PREFIX,
    });
    s3.send(listObjectsCommand).then(
      action((data) => {
        data.Contents?.forEach((object) => {
          const audioFile = object.Key?.split("/")[1];
          if (audioFile) audioStore.availableAudioFiles.push(audioFile);
        });
      })
    );
  }, [audioStore]);

  return (
    <>
      <IconButton
        aria-label="Loop audio"
        title="Loop audio"
        height={6}
        icon={<ImLoop size={17} />}
        bgColor={audioStore.audioLooping ? "orange.700" : undefined}
        _hover={
          audioStore.audioLooping
            ? {
                bgColor: "orange.600",
              }
            : undefined
        }
        onClick={action(() => audioStore.toggleAudioLooping())}
      />
      <IconButton
        aria-label="Mute/unmute audio"
        title="Mute/unmute audio"
        height={6}
        icon={<FaVolumeMute size={17} />}
        bgColor={audioStore.audioMuted ? "orange.700" : undefined}
        _hover={
          audioStore.audioMuted
            ? {
                bgColor: "orange.600",
              }
            : undefined
        }
        onClick={action(() => audioStore.toggleAudioMuted())}
      />

      <IconButton
        aria-label="Toggle waveform style"
        title="Toggle waveform style"
        height={6}
        icon={<BsSoundwave size={17} />}
        bgColor={uiStore.showingWaveformOverlay ? "orange.700" : undefined}
        _hover={
          uiStore.showingWaveformOverlay
            ? {
                bgColor: "orange.600",
              }
            : undefined
        }
        onClick={action(() => uiStore.toggleWaveformOverlay())}
      />
      <Select
        size="xs"
        width={40}
        value={audioStore.selectedAudioFile}
        onChange={action((e) => {
          audioStore.selectedAudioFile = e.target.value;
        })}
      >
        {audioStore.availableAudioFiles.map((audioFile) => (
          <option key={audioFile} value={audioFile}>
            {audioFile}
          </option>
        ))}
      </Select>
      <Tooltip label="Contact Ben to have your music added!" fontSize="xs">
        <span>
          <HiOutlineInformationCircle />
        </span>
      </Tooltip>
    </>
  );
});
