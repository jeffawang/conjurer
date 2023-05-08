// TODO: maybe use swr instead of axios
import useAxios from "axios-hooks";
import { memo, useState } from "react";
import {
  Button,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";
import { useStore } from "@/src/types/StoreContext";
import { action } from "mobx";

export const UserPicker = memo(function UserPicker() {
  const store = useStore();

  const { isOpen, onOpen, onClose } = useDisclosure({});

  const [newUser, setNewUser] = useState("");

  const [{ data, loading, error }, refetch] = useAxios(
    {
      url: "/api/users",
    },
    { useCache: false, manual: true }
  );

  let users: string[] = [];
  if (data) users = data.users.rows.map((row: any) => row.name);

  const [, createUser] = useAxios(
    {
      url: "/api/users",
      method: "POST",
    },
    { manual: true }
  );

  return (
    <>
      <Button
        onClick={() => {
          refetch();
          onOpen();
        }}
        leftIcon={<FaUser />}
      >
        {store.user}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Time to &quot;log in&quot;</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack alignItems="center">
              {users.map((user) => (
                <Button
                  key={user}
                  leftIcon={<FaUser />}
                  width="100%"
                  onClick={action(() => {
                    store.user = user;
                    onClose();
                  })}
                >
                  {user}
                </Button>
              ))}
            </VStack>

            <Text my={4}>Click a name above or type a new name:</Text>
            <HStack>
              <Input
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
              />
              <Button
                disabled={!newUser}
                onClick={action(async () => {
                  if (!newUser) return;

                  await createUser({
                    data: {
                      name: newUser,
                    },
                  });

                  onClose();
                })}
              >
                Create
              </Button>
            </HStack>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  );
});
