import { Stack, Spinner, Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import { useQueryClient, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";
import { Grant, Shareholder, User, Company, SharePrice } from "../../types";
import { OnboardingContext } from "./onboardingContext";


export function DoneStep() {
    const { authorize } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { email, userName, companyName, shareholders, grants, shareprice } =
      useContext(OnboardingContext);
  
    const grantMutation = useMutation<Grant, unknown, Grant>((grant) =>
      fetch("/grant/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grant }),
      }).then((res) => res.json())
    );
    const shareholderMutation = useMutation<Shareholder, unknown, Shareholder>(
      (shareholder) =>
        fetch("/shareholder/new", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(shareholder),
        }).then((res) => res.json()),
      {
        onSuccess: () => {
          queryClient.invalidateQueries("user");
        },
      }
    );
    const userMutation = useMutation<User, unknown, User>((user) =>
      fetch("/user/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      }).then((res) => res.json())
    );
    const companyMutation = useMutation<Company, unknown, Company>((company) =>
      fetch("/company/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(company),
      }).then((res) => res.json())
    );
    const sharepriceMutation = useMutation<SharePrice, unknown, SharePrice>((shareprice) =>
      fetch("/shareprice/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shareprice),
      }).then((res) => res.json())
    );
  
    React.useEffect(() => {
      async function saveData() {
        const user = await userMutation.mutateAsync({ email, name: userName });
        await Promise.all([
          ...Object.values(grants).map((grant) =>
            grantMutation.mutateAsync(grant)
          ),
          ...Object.values(shareholders).map((shareholder) =>
            shareholderMutation.mutateAsync(shareholder)
          ),
          companyMutation.mutateAsync({ name: companyName }),
          sharepriceMutation.mutateAsync({...shareprice}),
        ]);
  
        if (user) {
          authorize(user);
          navigate("/dashboard");
        } else {
          // Something bad happened.
          // show err to user
        }
      }
  
      saveData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    return (
      <Stack alignItems="center">
        <Spinner />
        <Text color="teal.400">...Wrapping up</Text>
      </Stack>
    );
  }