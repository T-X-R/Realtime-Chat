import { Box, Button, Input, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../context/ChatProvider";

const QuestionBox = () => {
  const { user } = ChatState();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();
  const [uploadFile, setUploadFile] = useState();

  const toast = useToast();

  const uploadHandler = async(f) => {
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
    // setFile(f)
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
    console.log(uploadFile);
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

      toast({
        title: "Upload Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      
      // setPic([data, ...pic])
      // setFetchAgain(!fetchAgain)
      setLoading(false);
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
        >
          {/* {pic ? (
            <Stack overflowY="scroll">
              {pic.map((p) => (
                <Image
                  src={p.images}
                  className="rounded img-thumbnail"
                  width="100%"
                  height="auto"
                  key={p._id}
                />
              ))}
            </Stack>
          ) : (
            <>Don't have pictures</>
          )} */}
        </Box>
      </Box>
    </>
  );
};

export default QuestionBox;
