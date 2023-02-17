import { Box, Button } from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";
import MyGallery from "../components/MyGallery";
import QuestionBox from "../components/QuestionBox";
import { ChatState } from "../context/ChatProvider";

const ItemPage = () => {
  const { user } = ChatState();
  const history = useHistory();

  const backHandler = () => {
    history.push("/chats");
    history.go();
  };

  return (
    <div style={{ width: "100%" }}>
      <Button
        display="flex"
        size="md"
        colorScheme="teal"
        variant="outline"
        marginTop={2}
        marginLeft={5}
        onClick={backHandler}
      >
        Back to Chat
      </Button>
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91vh"
        p="10px"
        marginTop={3}
      >
        {user && <MyGallery />}
        {user && <QuestionBox />}
      </Box>
    </div>
  );
};

export default ItemPage;
