import React, { useContext } from "react";
import { VictoryPie } from "victory";
import { Link, useParams } from "react-router-dom";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Text,
  Heading,
  Stack,
  Button,
  Input,
  StackDivider,
  Table,
  Thead,
  Tr,
  Tbody,
  Td,
  Modal,
  useDisclosure,
  ModalContent,
  Spinner,
  Alert,
  AlertTitle,
  AlertIcon,
  Select,
  IconButton,
} from "@chakra-ui/react";
import { AuthContext } from "../App";
import { GrantData, Group, SharePrice, Shareholder, ShareholderData } from "../types";
import { useMutation, useQuery, useQueryClient } from "react-query";
import produce from "immer";
// import { group } from "console";

// Moved this outside to avoid being declared on each render and make component harder to read
function getGroupData(shareholders: ShareholderData, grants: GrantData) {
  return ["investor", "founder", "employee"].map((group) => ({
    x: group,
    y: Object.values(shareholders)
      .filter((s) => s.group === group)
      .flatMap((s) => s.grants)
      .reduce((acc, grantID) => acc + grants[grantID].amount, 0),
  }));
}

function getInvestorData(shareholders: ShareholderData, grants: GrantData) {
  return Object.values(shareholders)
    .map((s) => ({
      x: s.name,
      y: s.grants.reduce((acc, grantID) => acc + grants[grantID].amount, 0),
    }))
    .filter((e) => e.y > 0);
}

function getShareTypeData(shareholders: ShareholderData, grants: GrantData) {
  const shareTypes = ["common", "preferred"];
  return shareTypes.map((type) => ({
    x: type,
    y: Object.values(grants)
      .filter((g) => g.type === type)
      .reduce((acc, g) => acc + g.amount, 0),
  }));
}

function getMarketCap(shareholders: ShareholderData, grants: GrantData, shareprice: SharePrice = { common: 0, preferred: 0 }) {
  return Object.values(shareholders).reduce((acc, s) => {
    return acc + s.grants.reduce(
      (acc, grantID) => {
        const price = grants[grantID].type === "common" ? shareprice?.common : shareprice?.preferred; 
        return acc + grants[grantID].amount * price;
      },
      0
    );
  }, 0);
}

function getDataByMode(mode: Group = "group", shareholders: ShareholderData, grants: GrantData) {
  if (mode === "group") {
    return getGroupData(shareholders, grants);
  }
  if (mode === "investor") {
    return getInvestorData(shareholders, grants);
  }
  if (mode === "sharetype") {
    return getShareTypeData(shareholders, grants)
  }
}

export function Dashboard() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const [newShareholder, setNewShareholder] = React.useState<
    Omit<Shareholder, "id" | "grants">
  >({ name: "", group: "employee" });
  const { mode } = useParams<{ mode: Group }>();
  const { deauthroize } = useContext(AuthContext);

  const shareholderMutation = useMutation<
    Shareholder,
    unknown,
    Omit<Shareholder, "id" | "grants">
  >(
    (shareholder) =>
      fetch("/shareholder/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shareholder),
      }).then((res) => res.json()),
    {
      onSuccess: (data) => {
        queryClient.setQueryData<{ [id: number]: Shareholder } | undefined>(
          "shareholders",
          (s) => {
            if (s) {
              return produce(s, (draft) => {
                draft[data.id] = data;
              });
            }
          }
        );
      },
    }
  );

  const grant = useQuery<GrantData, string>("grants", () =>
    fetch("/grants").then((e) => e.json())
  );

  const shareprice = useQuery<SharePrice, string>("shareprice", () =>
    fetch("/shareprice").then((e) => e.json())
  );

  const shareholder = useQuery<ShareholderData>(
    "shareholders",
    () => fetch("/shareholders").then((e) => e.json())
  );

  if (grant.status === "error") {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Error: {grant.error}</AlertTitle>
      </Alert>
    );
  }
  if (grant.status !== "success") {
    return <Spinner />;
  }
  if (!grant.data || !shareholder.data) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Failed to get any data</AlertTitle>
      </Alert>
    );
  }

  async function submitNewShareholder(e: React.FormEvent) {
    e.preventDefault();
    await shareholderMutation.mutateAsync(newShareholder);
    onClose();
  }

  return (
    <Stack>
      <Stack direction="row" justify="space-between" alignItems="baseline">
        <Heading
          size="md"
          bgGradient="linear(to-br, teal.400, teal.100)"
          bgClip="text"
        >
          Fair Share
        </Heading>
        <Stack direction="row">
          <Button
            colorScheme="teal"
            as={Link}
            to="/dashboard/investor"
            variant="ghost"
            isActive={mode === "investor"}
          >
            By Investor
          </Button>
          <Button
            colorScheme="teal"
            as={Link}
            to="/dashboard/group"
            variant="ghost"
            isActive={mode === "group"}
          >
            By Group
          </Button>
          <Button
            colorScheme="teal"
            as={Link}
            to="/dashboard/sharetype"
            variant="ghost"
            isActive={mode === "sharetype"}
          >
            By Share Type
          </Button>
          <IconButton aria-label='Log out' colorScheme='teal' onClick={() => { deauthroize() }}  icon={<ArrowForwardIcon />} />
        </Stack>
      </Stack>
      <Stack divider={<StackDivider />}>
        <Heading>Market Cap: ${getMarketCap(shareholder.data, grant.data, shareprice.data)}</Heading>
      </Stack>
      {/* labels cut outside of container */}
      <VictoryPie
        colorScale="blue"
        data={getDataByMode(mode, shareholder.data, grant.data)}
      />
      <Stack divider={<StackDivider />}>
        <Heading>Shareholders</Heading>
        <Table>
          <Thead>
            <Tr>
              <Td>Name</Td>
              <Td>Group</Td>
              <Td>Grants</Td>
              <Td>Shares</Td>
              <Td>Equity</Td>
            </Tr>
          </Thead>
          <Tbody>
            {Object.values(shareholder.data).map((s) => (
              <Tr key={s.id}>
                <Td>
                  <Link to={`/shareholder/${s.id}`}>
                    <Stack direction="row" alignItems="center">
                      <Text color="teal.600">{s.name}</Text>
                      <ArrowForwardIcon color="teal.600" />
                    </Stack>
                  </Link>
                </Td>
                <Td data-testid={`shareholder-${s.name}-group`}>{s.group}</Td>
                <Td data-testid={`shareholder-${s.name}-grants`}>
                  {s.grants.length}
                </Td>
                <Td data-testid={`shareholder-${s.name}-shares`}>
                  {s.grants.reduce(
                    (acc, grantID) => acc + grant.data[grantID].amount,
                    0
                  )}
                </Td>
                <Td data-testid={`shareholder-${s.name}-equity`}>
                ${s.grants.reduce(
                    (acc, grantID) => {
                      const price = grant.data[grantID].type === "common" ? shareprice.data?.common : shareprice.data?.preferred;
                      return acc + (grant.data[grantID].amount * price);
                    },
                    0
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Button onClick={onOpen}>Add Shareholder</Button>
        <Button as={Link} to="/dashboard/shareprice">Edit Shareprice</Button>
        {/* is it worth Refactoring this modal into his own component to use it in onboarding and here? */}
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
                    group: e.target.value as any,
                  }))
                }
              >
                <option value="investor">Investor</option>
                <option value="founder">Founder</option>
                <option value="employee">Employee</option>
              </Select>
              <Button type="submit" colorScheme="teal">
                Save
              </Button>
            </Stack>
          </ModalContent>
        </Modal>
      </Stack>
    </Stack>
  );
}
