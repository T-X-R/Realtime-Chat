import {
  Box,
  Button,
  Input,
  useToast,
  Stack,
  Text,
  Card,
  CardBody,
  Badge,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { ChatState } from "../context/ChatProvider";

const QuestionBox = () => {
  const { user } = ChatState();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();
  const [uploadFile, setUploadFile] = useState();
  const [fetchAgain, setFetchAgain] = useState(false);

  const toast = useToast();

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/file", config);
      if (data.length === 0) {
        return;
      }
      console.log(data);
      setFile(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to Load Questions",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [fetchAgain]);

  const uploadHandler = (f) => {
    setLoading(true);
    if (!f) {
      toast({
        title: "Please Select a CSV file",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const data = new FormData();
    data.append("file", f);
    data.append("upload_preset", "My project");
    data.append("cloud_name", "dosuotitt");
    fetch("https://api.cloudinary.com/v1_1/dosuotitt/auto/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUploadFile(data.url.toString());
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const csvHandler = async () => {
    setLoading(true);
    // console.log(uploadFile);
    if (!uploadFile) {
      toast({
        title: "Please Select a CSV File",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }

    // save image to mongoDB
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/file/uploadfile",
        {
          id: user._id,
          uploadFile,
        },
        config
      );
      console.log(data);
      if (data) {
        toast({
          title: "Save Data Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setFetchAgain(!fetchAgain);
        setLoading(false);
      } else {
        toast({
          title: "Error Occured",
          description: "Failed to Save Data",
          status: "error",
          duration: 6000,
          isClosable: true,
          position: "top",
        });
        setLoading(false);
      }
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        flexDir="column"
        p={3}
        bg="white"
        w={{ base: "100%", md: "59%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box
          pb={2}
          px={2}
          fontSize={{ base: "26px", md: "28px" }}
          fontFamily="Work sans"
          display="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          My Question Box
        </Box>
        <Box display="flex" w="100%" justifyContent="space-between">
          <Input
            type="file"
            placeholder="Upload Picture"
            p={1.5}
            size="md"
            accept=".csv"
            onChange={(e) => uploadHandler(e.target.files[0])}
          />
          <Button marginLeft={3} onClick={csvHandler}>
            Upload
          </Button>
        </Box>
        <Box
          display="flex"
          flexDir="column"
          p={3}
          bg="#F8F8F8"
          w="100%"
          h="100%"
          marginTop={3}
          borderRadius="lg"
          overflowY="hidden"
          fontFamily="Work sans"
        >
          {file ? (
            <Stack overflowY="scroll">
              {file.map((fi) => (
                <Card key={fi._id}>
                  <CardBody>
                    <Box display="flex" w="100%" alignItems="baseline">
                      <Badge
                        borderRadius="full"
                        px="3"
                        variant="subtle"
                        colorScheme="teal"
                      >
                        {fi.level}
                      </Badge>
                      <Text marginLeft={3}>{fi.text}</Text>
                    </Box>
                    <RadioGroup ml={5} mt={1}>
                      <Stack>
                        {fi.answers.map((a, i) => (
                          <Radio key={i} value={a}>
                            {a}
                          </Radio>
                        ))}
                      </Stack>
                    </RadioGroup>
                  </CardBody>
                </Card>
              ))}
            </Stack>
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              h="100%"
            >
              <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                Don't have questions
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default QuestionBox;
