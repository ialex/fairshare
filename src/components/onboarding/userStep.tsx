import { Stack, FormControl, FormLabel, Input, FormHelperText, Button } from "@chakra-ui/react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingContext } from "./onboardingContext";


export function UserStep() {
    const { userName, email, dispatch } = useContext(OnboardingContext);
    const navigate = useNavigate();
  
    function onSubmt(e: React.FormEvent) {
      e.preventDefault();
      navigate("../company");
    }
  
    return (
      <Stack as="form" onSubmit={onSubmt} spacing="4">
        <FormControl id="userName" size="lg" color="teal.400">
          <FormLabel>First, who is setting up this account?</FormLabel>
          <Input
            type="text"
            placeholder="Your Name"
            onChange={(e) =>
              dispatch({ type: "updateUser", payload: e.target.value })
            }
            value={userName}
          />
        </FormControl>
        <FormControl id="email" size="lg" color="teal.400">
          <FormLabel>What email will you use to sign in?</FormLabel>
          <Input
            type="email"
            placeholder="Your Email"
            onChange={(e) =>
              dispatch({ type: "updateEmail", payload: e.target.value })
            }
            value={email}
          />
          <FormHelperText>
            We only use this to create your account.
          </FormHelperText>
        </FormControl>
        <Button
          type="submit"
          colorScheme="teal"
          disabled={!userName.length || !email.length}
        >
          Next
        </Button>
      </Stack>
    );
  }