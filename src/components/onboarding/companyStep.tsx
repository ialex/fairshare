import { Stack, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingContext } from "./onboardingContext";


export function CompanyStep() {
    const { companyName, email, shareprice, dispatch } = useContext(OnboardingContext);
    const navigate = useNavigate();
  
    function onSubmit(e: React.FormEvent) {
      e.preventDefault();
      navigate("../shareholders");
    }
  
    useEffect(() => {
      if (!email) {
        navigate('/start/user');
      }
    }, [email, navigate]);

    const isDataValid = companyName !== "" && shareprice.common > 0 && shareprice.preferred > 0;
  
    return (
      <Stack as="form" onSubmit={onSubmit} spacing="4">
        <FormControl id="companyName" size="lg" color="teal.400">
          <FormLabel>What company are we examining?</FormLabel>
          <Input
            type="text"
            placeholder="Company Name"
            onChange={(e) =>
              dispatch({ type: "updateCompany", payload: e.target.value })
            }
            value={companyName}
          />
        </FormControl>
        <FormControl id="commonSharePrice" size="lg" color="teal.400">
          <FormLabel>Common Share Price</FormLabel>
          <Input
            type="number"
            name="commonSharePrice"
            placeholder="Common Share Price"
            onChange={(e) =>
              dispatch({ type: "updateShareprice", payload: {...shareprice, common: parseFloat(e.target.value) } })
            }
            value={shareprice.common}
          />
        </FormControl>
        <FormControl id="preferredSharePrice" size="lg" color="teal.400">
          <FormLabel>Preferred Share Price</FormLabel>
          <Input
            type="number"
            name="preferredSharePrice"
            placeholder="Preferred Share Price"
            onChange={(e) =>
              dispatch({ type: "updateShareprice", payload: {...shareprice, preferred: parseFloat(e.target.value)}})
            }
            value={shareprice.preferred}
          />
        </FormControl>
        {isDataValid && <Button type="submit" colorScheme="teal">
          Next
        </Button>}
      </Stack>
    );
  }