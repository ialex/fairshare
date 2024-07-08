import { useDisclosure, useToast, Text, Stack, StackDivider, Badge, Modal, ModalContent, Input, Select, Button } from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shareholder, ShareholderGroup } from "../../types";
import { OnboardingContext } from "./onboardingContext";



export function ShareholdersStep() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { shareholders, companyName, dispatch } = useContext(OnboardingContext);
    const [newShareholder, setNewShareholder] = React.useState<
      Omit<Shareholder, "id" | "grants">
    >({ name: "", group: "employee" });
    const navigate = useNavigate();
    const toast = useToast();
    const firstShareHolderId = Object.keys(shareholders)[0];
  
    useEffect(() => {
      if (!companyName) {
        navigate('/start/company');
      }
    }, [companyName, navigate]);
  
    function submitNewShareholder(e: React.FormEvent) {
      e.preventDefault();
      if (!newShareholder.name.trim()) {
        toast({
          title: 'Error',
          description: 'Shareholder name cannot be empty.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      dispatch({ type: "addShareholder", payload: newShareholder });
      setNewShareholder({ name: "", group: "employee" });
      onClose();
    }
  
    return (
      <Stack>
        <Text color="teal.400">
          Who are <strong>{companyName}</strong>'s shareholders?
        </Text>
        <Stack divider={<StackDivider borderColor="teal-200" />}>
          {Object.values(shareholders).map((s, i) => (
            <Stack justify="space-between" direction="row" key={i}>
              <Text>{s.name}</Text>
              <Badge>{s.group}</Badge>
            </Stack>
          ))}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
              <Stack p="10" as="form" onSubmit={submitNewShareholder}>
                <Input
                  value={newShareholder.name}
                  placeholder="Shareholder Name"
                  onChange={(e) =>
                    setNewShareholder((s) => ({ ...s, name: e.target.value }))
                  }
                />
                <Select
                  placeholder="Type of shareholder"
                  value={newShareholder.group}
                  onChange={(e) =>
                    setNewShareholder((s) => ({
                      ...s,
                      group: e.target.value as ShareholderGroup,
                    }))
                  }
                >
                  <option value="investor">Investor</option>
                  <option value="founder">Founder</option>
                  <option value="employee">Employee</option>
                </Select>
                <Button type="submit" colorScheme="teal">
                  Create
                </Button>
              </Stack>
            </ModalContent>
          </Modal>
        </Stack>
        <Button colorScheme="teal" variant="outline" onClick={onOpen}>
          Add Shareholder
        </Button>
        {/* disabled props on button was not applying disabled styling when enabled */}
        {firstShareHolderId && <Button as={Link} to={`/start/grants/${firstShareHolderId}`} colorScheme="teal">
          Next
        </Button>}
      </Stack>
    );
  }