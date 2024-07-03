import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heading,
  Stack,
  Button,
  Input,
  FormControl,
  Spinner,
  Alert,
  AlertTitle,
  AlertIcon,
  IconButton,
  FormLabel,
} from "@chakra-ui/react";
import { SharePrice } from "../types";
import { useMutation, useQuery, useQueryClient } from "react-query";
import produce from "immer";
import { CloseIcon } from "@chakra-ui/icons";

export function SharePricePage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const sharepriceQuery = useQuery<SharePrice>("shareprice", () =>
    fetch("/shareprice").then((e) => e.json())
  );

  const [sharePrice, setSharePrice] = React.useState<SharePrice>({
    common: sharepriceQuery.data?.common || 0,
    preferred: sharepriceQuery.data?.preferred || 0 ,
  });

  const sharepriceMutation = useMutation<SharePrice, unknown, SharePrice>(
    (shareprice) =>
      fetch("/shareprice/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shareprice),
      }).then((res) => res.json()),
    {
      onSuccess: (data) => {
        queryClient.setQueryData<SharePrice | undefined>("shareprice", (s) => {
          return produce(s, (draft) => {
            draft = data;
          });
        });
      },
    }
  );

  async function submitSharePrice(e: React.FormEvent) {
    e.preventDefault();
    try {
      await sharepriceMutation.mutateAsync(sharePrice);
      return navigate('/dashboard');
    } catch (e) {
      console.warn(e);
    }
  }

  if (sharepriceQuery.status !== "success") {
    return <Spinner />;
  }
  if (!sharepriceQuery.data) {
    console.log('error');
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Error: {sharepriceQuery["error"]}</AlertTitle>
      </Alert>
    );
  }

  return (
    <Stack spacing={6} p={6}>
      <Stack direction="row" justify="space-between" alignItems="baseline">
        <Heading
          size="md"
          bgGradient="linear(to-br, teal.400, teal.100)"
          bgClip="text"
        >
          Fair Share
        </Heading>
        <Stack direction="row">
          <IconButton as={Link} to="/dashboard" colorScheme="teal" aria-label='Dashboard' icon={<CloseIcon />} />
        </Stack>
      </Stack>
      <Heading size="md" textAlign="center">
        Update Share Price
      </Heading>
      <form onSubmit={submitSharePrice}>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Common Share Price</FormLabel>
            <Input
              variant="flushed"
              placeholder="Common Share Price"
              type="number"
              value={sharePrice.common}
              onChange={(e) =>
                setSharePrice((sp) => ({
                  ...sp,
                  common: parseFloat(e.target.value),
                }))
              }
            />
          </FormControl>
          <FormControl>
          <FormLabel>Preferred Share Price</FormLabel>
            <Input
              variant="flushed"
              placeholder="Preferred Share Price"
              type="number"
              value={sharePrice.preferred}
              onChange={(e) =>
                setSharePrice((sp) => ({
                  ...sp,
                  preferred: parseFloat(e.target.value),
                }))
              }
            />
          </FormControl>
          <Button type="submit" colorScheme="teal">
            Save
          </Button>
        </Stack>
      </form>
    </Stack>
    );
}
