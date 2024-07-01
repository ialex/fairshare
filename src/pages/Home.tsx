import React from "react";
import { Link } from "react-router-dom";
import { Text, Heading, Stack, Button } from "@chakra-ui/react";
import { ReactComponent as HoldDoc } from "../assets/hold-doc.svg";

export function Home() {
  return (
    <Stack direction="column" alignItems="center" spacing="10">
      <HoldDoc width="50%" height="auto" />
      <Heading
        size="4xl"
        bgGradient="linear(to-br, teal.400, teal.100)"
        bgClip="text"
      >
        Fair Share
      </Heading>
      <Text fontSize="2xl" color="teal.600" align="center" fontWeight="thin">
        We make understanding equity easy–so everyone is on equal footing
      </Text>

      <Text fontSize="md" color="teal.600">
        Empower your employees and investors to understand and manage their
        equity all in one place, using the worlds <strong>first</strong> AI
        powered 🤖 equity management platform.
      </Text>
      <Stack direction="row">
        <Button as={Link} to="/start" colorScheme="teal">
          Get Started
        </Button>
        <Button as={Link} to="/signin" colorScheme="teal" variant="ghost">
          Sign In
        </Button>
      </Stack>
    </Stack>
  );
}
