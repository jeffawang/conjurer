import { useEffect } from "react";
import { ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { observer } from "mobx-react-lite";
import { HStack, IconButton, Select, Tooltip } from "@chakra-ui/react";
import { RiZoomInLine, RiZoomOutLine } from "react-icons/ri";
import { BsSoundwave } from "react-icons/bs";
import { BiTimer } from "react-icons/bi";
import { FaFolderOpen, FaRegClipboard, FaVolumeMute } from "react-icons/fa";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { FiSave } from "react-icons/fi";
import { useStore } from "@/src/types/StoreContext";
import { action, runInAction } from "mobx";
import {
  AUDIO_BUCKET_NAME,
  AUDIO_BUCKET_PREFIX,
  AUDIO_BUCKET_REGION,
} from "@/src/utils/audio";
import { TimerControls } from "@/src/components/TimerControls";
import { TimerReadout } from "@/src/components/TimerReadout";

export const Controls = observer(function Controls() {
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
    <HStack my={2} width="100%">
      <TimerReadout />
      <TimerControls />
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
      {/* <ExperienceTitle /> */}
      <IconButton
        aria-label="Copy to clipboard"
        title="Copy to clipboard"
        height={6}
        icon={<FaRegClipboard size={17} />}
        onClick={() =>
          navigator.clipboard.writeText(JSON.stringify(store.serialize()))
        }
      />
      <IconButton
        aria-label="Save"
        title="Save"
        height={6}
        icon={<FiSave size={17} />}
        onClick={() => store.saveToLocalStorage("arrangement")}
      />
      <IconButton
        aria-label="Open last saved"
        title="Open"
        height={6}
        icon={<FaFolderOpen size={17} />}
        onClick={() => store.loadFromLocalStorage("arrangement")}
      />
      <IconButton
        aria-label="Open last auto saved"
        title="Open last auto saved"
        height={6}
        icon={<BiTimer size={18} />}
        onClick={() => store.loadFromLocalStorage("autosave")}
      />
      <IconButton
        aria-label="Zoom in"
        title="Zoom in"
        height={6}
        icon={<RiZoomInLine size={17} />}
        onClick={action(() => uiStore.zoomIn())}
      />
      <IconButton
        aria-label="Zoom out"
        title="Zoom out"
        height={6}
        icon={<RiZoomOutLine size={17} />}
        onClick={action(() => uiStore.zoomOut())}
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
      {/* <Popover
        placement="bottom"
        isLazy
        returnFocusOnClose={false}
        openDelay={0}
        closeDelay={0}
      >
        <PopoverTrigger>
          <IconButton
            aria-label="Tempo"
            title="Tempo"
            height={6}
            icon={<FaDrum size={17} />}
          />
        </PopoverTrigger>
        <Portal>
          <PopoverContent>
            <TempoControls />
          </PopoverContent>
        </Portal>
      </Popover> */}

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
    </HStack>
  );
});
