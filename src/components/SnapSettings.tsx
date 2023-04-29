import { useEffect, useState } from "react";
import { ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { observer } from "mobx-react-lite";
import {
  Box,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Select,
  Text,
} from "@chakra-ui/react";
import { RiZoomInLine, RiZoomOutLine } from "react-icons/ri";
import { BsSoundwave, BsGearFill } from "react-icons/bs";
import { BiTimer } from "react-icons/bi";
import { FaFolderOpen, FaRegClipboard } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { useStore } from "@/src/types/StoreContext";
import { action, runInAction } from "mobx";
import {
  AUDIO_BUCKET_NAME,
  AUDIO_BUCKET_PREFIX,
  AUDIO_BUCKET_REGION,
} from "@/src/utils/audio";

export default observer(function SnapSettings() {
  const store = useStore();
  const { uiStore, audioStore } = store;

  // const [beatLength, setBeatLength] = useState(1);

  return (
    <Box>
      <NumberInput
        size="md"
        step={0.1}
        onChange={action((valueString) => {
          const value = parseFloat(valueString);
          if (!isNaN(value)) uiStore.beatLength = value;
        })}
        value={uiStore.beatLength}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </Box>
  );
});
