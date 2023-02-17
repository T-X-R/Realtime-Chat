import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Image, Input, Stack, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";

const MyGallery = () => {
  const [pic, setPic] = useState();
  const [uploadPic, setUploadPic] = useState();
  const [loading, setLoading] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  const toast = useToast();

  const fetchPics = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/item", config);
    //   console.log(pic);
      setPic(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to Load Pictures",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  useEffect(() => {
    fetchPics();
  }, [fetchAgain]);

  const uploadHandler = (p) => {
    setLoading(true);
    if (p === undefined) {
      toast({
        title: "Please Select an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (p.type === "image/jpeg" || p.type === "image/png") {
      const data = new FormData();
      data.append("file", p);
      data.append("upload_preset", "My project");
      data.append("cloud_name", "dosuotitt");
      fetch("https://api.cloudinary.com/v1_1/dosuotitt/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setUploadPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  const saveHandler = async () => {
    setLoading(true);
    if (!uploadPic) {
      toast({
        title: "Please Select a Picture",
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
        "/api/item/uploadimg",
        {
          id: user._id,
          uploadPic,
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
    //   console.log(data);
      setPic([data, ...pic])
      setFetchAgain(!fetchAgain)
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
        flexDir="column"
        alignItems="center"
        p={3}
        bg="white"
        w={{ base: "100%", md: "40%" }}
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
          My Gallery
        </Box>
        <Box display="flex" w="100%" justifyContent="space-between">
          <Input
            type="file"
            placeholder="Upload Picture"
            p={1.5}
            size="md"
            accept="image/*"
            onChange={(e) => uploadHandler(e.target.files[0])}
          />
          <Button marginLeft={3} onClick={saveHandler}>
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
          {pic ? (
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
          )}
        </Box>
      </Box>
    </>
  );
};

export default MyGallery;
